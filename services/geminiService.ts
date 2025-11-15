import { GoogleGenAI } from "@google/genai";
import { ChatMessage, GenerateContentParams, Mode, OutputData, PoemSuggestion, PromptTag, ProverbSuggestion, RefineContentParams } from '../types';

// Read one or more API keys from environment variables
// Prefer GEMINI_API_KEYS (comma-separated), then GEMINI_API_KEY, then API_KEY as fallback
const rawKeys = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!rawKeys) {
    throw new Error('GEMINI_API_KEYS / GEMINI_API_KEY / API_KEY is not defined in environment variables');
}

const apiKeys = rawKeys
    .split(',')
    .map(key => key.trim())
    .filter(key => key.length > 0);

if (apiKeys.length === 0) {
    throw new Error('No valid API keys provided in GEMINI_API_KEYS / GEMINI_API_KEY / API_KEY');
}

// Create a client instance for each key and rotate them in a round-robin fashion
const aiClients = apiKeys.map(key => new GoogleGenAI({ apiKey: key }));
let currentClientIndex = 0;

// Indices of clients that passed the last health check. If null, health check has not run yet.
let healthyClientIndices: number[] | null = null;
let hasHealthCheckRun = false;

// Indices of clients that have been marked unhealthy during this session (runtime key errors)
const disabledClientIndices = new Set<number>();

// Once we discover that the primary model (gemini-2.5-pro) is unstable but flash works,
// we permanently switch all remaining calls in this session to gemini-2.5-flash.
const PRIMARY_MODEL = 'gemini-2.5-pro';
const FALLBACK_MODEL = 'gemini-2.5-flash';
let forceFlashForAllCalls = false;

export interface ApiHealthSummary {
    totalCount: number;
    healthyCount: number;
}

/**
 * Runs a lightweight health check against all configured API keys.
 * Any key that successfully answers a tiny test prompt is considered "healthy".
 * The result is cached in-memory and used by getAiClient() for routing.
 */
export async function healthCheckAllApiKeys(): Promise<ApiHealthSummary> {
    if (aiClients.length === 0) {
        healthyClientIndices = [];
        hasHealthCheckRun = true;
        return { totalCount: 0, healthyCount: 0 };
    }

    const results = await Promise.allSettled(
        aiClients.map(async (client, index) => {
            try {
                // Use a very small, cheap request just to verify the key works.
                await client.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: 'سلام! این یک تست خیلی کوتاه برای بررسی سلامت کلید API است. فقط یک کلمه «سلام» جواب بده.',
                    config: {}
                });
                return true;
            } catch (err) {
                console.error(`API key health check failed for index ${index}:`, err);
                throw err;
            }
        })
    );

    const newHealthy: number[] = [];
    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            newHealthy.push(index);
        }
    });

    healthyClientIndices = newHealthy;
    hasHealthCheckRun = true;

    return {
        totalCount: aiClients.length,
        healthyCount: newHealthy.length,
    };
}

function getClientPoolIndices(): number[] {
    let baseIndices: number[];

    if (hasHealthCheckRun) {
        if (healthyClientIndices && healthyClientIndices.length > 0) {
            baseIndices = healthyClientIndices;
        } else {
            baseIndices = [];
        }
    } else {
        baseIndices = aiClients.map((_, index) => index);
    }

    return baseIndices.filter(index => !disabledClientIndices.has(index));
}

interface AiClientWithIndex {
    client: GoogleGenAI;
    index: number;
}

function getAiClientInternal(): AiClientWithIndex {
    if (aiClients.length === 0) {
        throw new Error('هیچ کلید API برای Gemini پیکربندی نشده است. لطفاً GEMINI_API_KEYS را تنظیم کن.');
    }

    const poolIndices = getClientPoolIndices();

    if (poolIndices.length === 0) {
        // All keys are either unhealthy from health check or have been disabled at runtime
        throw new Error('در حال حاضر هیچ کلید API فعالی در دسترس نیست. لطفاً در تنظیمات محیط (env) کلیدهای جدید اضافه کن.');
    }

    const indexInPool = currentClientIndex % poolIndices.length;
    const clientIndex = poolIndices[indexInPool];
    currentClientIndex = (currentClientIndex + 1) % poolIndices.length;
    return { client: aiClients[clientIndex], index: clientIndex };
}

// Backwards-compatible helper for places that only need the client instance
function getAiClient(): GoogleGenAI {
    return getAiClientInternal().client;
}

function markClientAsDisabled(index: number) {
    disabledClientIndices.add(index);
    if (healthyClientIndices) {
        healthyClientIndices = healthyClientIndices.filter(i => i !== index);
    }
}

function isApiKeyError(error: any): boolean {
    if (!error) return false;

    const anyErr = error as any;
    const status = anyErr.status ?? anyErr.code;
    if (status === 401 || status === 403 || status === 'UNAUTHENTICATED' || status === 'PERMISSION_DENIED') {
        return true;
    }

    const message = String(anyErr.message || '').toLowerCase();

    const keyIndicators = [
        'api key',
        'apikey',
        'invalid api key',
        'invalid key',
        'key is invalid',
        'no api key',
        'gemini_api_keys',
        'billing',
        'unauthorized',
        'permission denied',
        'هیچ کلید api فعالی',
        'کلیدهای هوش مصنوعی'
    ];

    return keyIndicators.some(indicator => message.includes(indicator));
}

async function withClientForModel<T>(
    modelName: string,
    operation: (client: GoogleGenAI, modelName: string, clientIndex: number) => Promise<T>
): Promise<T> {
    let lastError: any = null;

    // We never want to loop forever; at most try each client once for this call.
    const maxAttempts = aiClients.length;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        let aiWithIndex: AiClientWithIndex;
        try {
            aiWithIndex = getAiClientInternal();
        } catch (err) {
            // No available clients
            lastError = lastError || err;
            break;
        }

        try {
            return await operation(aiWithIndex.client, modelName, aiWithIndex.index);
        } catch (err) {
            // If this looks like a key-related error, mark this client as unhealthy
            if (isApiKeyError(err)) {
                markClientAsDisabled(aiWithIndex.index);
                lastError = err;
                continue; // Try next available client
            }

            // For non-key errors (network, server, model issues), propagate immediately
            throw err;
        }
    }

    if (lastError) {
        throw lastError;
    }

    // Fallback safety – should normally be unreachable
    throw new Error('در حال حاضر هیچ کلید API فعالی در دسترس نیست. باید کلیدهای جدید در تنظیمات محیط (env) اضافه شود.');
}

async function callWithProThenFlash<T>(
    operation: (client: GoogleGenAI, modelName: string) => Promise<T>
): Promise<T> {
    // If we already discovered that pro is unstable but flash works, always go straight to flash.
    if (forceFlashForAllCalls) {
        return withClientForModel(FALLBACK_MODEL, (client) => operation(client, FALLBACK_MODEL));
    }

    try {
        return await withClientForModel(PRIMARY_MODEL, (client) => operation(client, PRIMARY_MODEL));
    } catch (error) {
        // If the failure is clearly due to API keys, trying another model will not help.
        if (isApiKeyError(error)) {
            throw error;
        }

        // Primary model had a non-key error (capacity, transient server failure, etc.).
        // Try the lighter flash model as a fallback.
        try {
            const result = await withClientForModel(FALLBACK_MODEL, (client) => operation(client, FALLBACK_MODEL));
            // If flash worked, switch all future calls in this session to flash.
            forceFlashForAllCalls = true;
            return result;
        } catch (fallbackError) {
            // If flash also failed, bubble up that error so the UI can show the global error popup.
            throw fallbackError;
        }
    }
}

// Check if user is requesting a long article
function isLongArticleRequested(inputText: string): boolean {
    const longKeywords = [
        'طولانی', 'خیلی طولانی', 'مفصل', 'جامع و کامل', 'بلند',
        'long', 'very long', 'detailed', 'comprehensive', 'extensive'
    ];
    const lowerInput = inputText.toLowerCase();
    return longKeywords.some(keyword => lowerInput.includes(keyword));
}

function generatePrompt(mode: Mode, inputText: string, selectedTags?: PromptTag[]): string {
    let basePrompt = '';

    switch (mode) {
        case Mode.GENERATE_HEADLINES:
            basePrompt = `تو یک دستیار آشپزخانه مهربان برای «مامان‌جون» هستی.
بر اساس توضیح و مواد داده‌شده در ورودی زیر، چند ایده غذای سریع، خونگی و در دسترس پیشنهاد بده:

"${inputText}"

حداقل ۸ و حداکثر ۱۲ ایده بده.
هر ایده باید یک جمله‌ی خیلی کوتاه باشد (اسم غذا + یک توضیح خیلی کوتاه).
نتیجه را فقط به صورت یک آرایه JSON از رشته‌ها برگردان، مثل:
["کوکوی سیب‌زمینی فوری با فر", "اسپاگتی سریع با قارچ و سینه مرغ", ...]`;
            break;
        case Mode.FIND_POEMS:
            basePrompt = `تو یک برنامه‌ریز منوی هفتگی برای خانواده هستی که به مامان‌جون کمک می‌کنی.
بر اساس توضیح زیر، یک برنامه غذای خونگی برای چند روز پشت سر هم بنویس (۵ تا ۷ روز):

"${inputText}"

برای هر روز، در خروجی یک شیء JSON با کلیدهای زیر بساز:
- "poem": توضیح منوی آن روز (مثلاً «ناهار: قیمه با برنج ساده + سالاد شیرازی، شام: املت سبزیجات با نان سنگک»)
- "poet": عنوان کوتاه برای آن روز یا نام روز هفته (مثلاً «روز پرکار»، «جمعه خانوادگی»)
- "meaning": توضیح کوتاه در مورد این‌که چرا این ترکیب غذا برای آن روز مناسب است
- "usage": یک نکتهٔ عملی یا ترفند آشپزی/برنامه‌ریزی که به اجرای بهتر این برنامه کمک کند

نتیجه را به صورت یک آرایه JSON از این اشیاء برگردان.`;
            break;
        case Mode.WRITE_ARTICLE:
            // Check if user wants a long recipe-style article
            if (isLongArticleRequested(inputText)) {
                basePrompt = `تو یک سرآشپز مهربان برای مامان‌جون هستی.
برای "${inputText}" یک رسپی کامل، مفصل و مرحله‌به‌مرحله بنویس. متن باید:
- به زبان فارسی روان و خودمانی اما محترمانه باشد
- شامل بخش «مواد لازم» با مقادیر دقیق و قابل‌فهم (لیوان، قاشق، گرم و ...)
- شامل بخش «طرز تهیه» به صورت مراحل شماره‌گذاری شده
- شامل بخش «نکته‌های مهم» برای خوشمزه‌تر شدن، خراب نشدن و سرو بهتر
- به اندازه‌ای طولانی باشد که همه جزئیات مهم را پوشش دهد.`;
            } else {
                basePrompt = `تو یک سرآشپز مهربان برای مامان‌جون هستی.
برای "${inputText}" یک رسپی کامل و مرحله‌به‌مرحله بنویس. متن باید:
- حدوداً در حد یک رسپی معمولی باشد (نه خیلی کوتاه، نه خیلی طولانی)
- شامل بخش «مواد لازم» با مقادیر دقیق و قابل‌فهم (لیوان، قاشق، گرم و ...)
- شامل بخش «طرز تهیه» به صورت مراحل شماره‌گذاری شده
- شامل چند «نکته مهم» کوتاه برای بهتر شدن نتیجه
لحن را صمیمی و تشویق‌کننده نگه دار، مثل وقتی که یک دوست باتجربه به مامان‌جون توضیح می‌دهد.`;
            }
            break;
        case Mode.REWRITE_TEXT:
            basePrompt = `تو هم‌زمان نقش یک آشپز خانگی باتجربه و مشاور تغذیه را داری.
بر اساس توضیح یا رسپی زیر، یک نسخه سالم‌تر و سبک‌تر از همان غذا برای مامان‌جون پیشنهاد بده:

"${inputText}"

در نسخه جدید:
- تا حد امکان روغن، سرخ‌کردن، نمک و قند را کم کن
- در صورت نیاز، مواد را با جایگزین‌های سالم‌تر عوض کن (مثلاً لبنیات کم‌چرب، پروتئین کم‌چرب، سبزیجات بیشتر)
- اگر امکانش هست، راه‌حل‌هایی برای فریز کردن و مصرف دوباره پیشنهاد بده

خروجی را به شکل یک رسپی قابل اجرا بنویس: «مواد لازم»، «طرز تهیه» مرحله‌به‌مرحله و «نکته‌های مهم». لحن صمیمی و امیدبخش باشد.`;
            break;
        case Mode.FIND_PROVERBS:
            basePrompt = `تو یک مامان باتجربه و پر از فوت‌وفن آشپزخانه هستی.
در مورد "${inputText}" چند نکته و ترفند کاملاً عملی و قابل اجرا در آشپزخانه برای مامان‌جون پیشنهاد بده (حداقل ۶ مورد).

خروجی باید یک آرایه JSON از اشیاء با کلیدهای زیر باشد:
- "proverb": خودِ نکته یا ترفند به صورت یک جمله کوتاه و واضح (مثل یک ضرب‌المثل یا جمله‌ی قصار مامان‌ها)
- "meaning": توضیح بیشتر در مورد آن نکته و این‌که چرا مفید است
- "usage": مثال یا موقعیتی که این نکته در آن به درد مامان‌جون می‌خورد

پاسخ را دقیقاً در قالب JSON معتبر با ساختار زیر برگردان:
[{ "proverb": "...", "meaning": "...", "usage": "..." }]`;
            break;
        default:
            throw new Error('Invalid mode selected');
    }

    // Add tag customizations if any tags are selected
    if (selectedTags && selectedTags.length > 0) {
        const tagInstructions = selectedTags.map(tag => tag.promptFragment).join('\n- ');
        basePrompt += `\n\nهمچنین هنگام تولید، حتماً این نکات را دقیق رعایت کن:\n- ${tagInstructions}`;

        // For JSON modes, reinforce the format requirement after tags
        if (mode === Mode.GENERATE_HEADLINES || mode === Mode.FIND_POEMS || mode === Mode.FIND_PROVERBS) {
            basePrompt += `\n\nتوجه: با وجود نکات بالا، حتماً خروجی را دقیقاً به همان فرمت JSON خواسته‌شده برگردان.`;
        }
    }

    // Global language enforcement
    if (mode === Mode.GENERATE_HEADLINES || mode === Mode.FIND_POEMS || mode === Mode.FIND_PROVERBS) {
        // JSON modes: keep keys in English, but all text values must be Farsi
        basePrompt += `\n\nدر تمام مقادیر متنی داخل JSON، متن را کاملاً به زبان فارسی روان و طبیعی بنویس. نام کلیدهای JSON (مانند poem, poet, meaning, usage, proverb) را دقیقاً مطابق الگوی داده‌شده و به زبان انگلیسی نگه دار و آن‌ها را ترجمه نکن. از نوشتن جملات یا توضیحات انگلیسی در مقادیر متنی خودداری کن، مگر در نام‌های خاص یا اصطلاحات واقعاً غیرقابل‌جایگزین.`;
    } else {
        // Text modes: everything should be Farsi
        basePrompt += `\n\nدر هر صورت، خروجی نهایی را ۱۰۰٪ به زبان فارسی روان و طبیعی بنویس و از نوشتن متن انگلیسی خودداری کن، مگر برای نام‌های خاص یا واژه‌هایی که معادل دقیق فارسی ندارند.`;
    }

    return basePrompt;
}

// Enforce 25-line limit for articles (when not requesting long text)
function enforceLineLimit(text: string, mode: Mode, inputText: string): string {
    if (mode === Mode.WRITE_ARTICLE && !isLongArticleRequested(inputText)) {
        const lines = text.split('\n').filter(line => line.trim() !== '');
        if (lines.length > 25) {
            // Take first 25 lines, trying to end at a paragraph boundary
            let truncated = lines.slice(0, 25).join('\n');
            // If the last line doesn't end with proper punctuation, try to end at previous sentence
            if (!truncated.match(/[.!?؟]$/)) {
                const sentences = truncated.split(/[.!?؟]/);
                if (sentences.length > 1) {
                    sentences.pop(); // Remove incomplete last sentence
                    truncated = sentences.join('.') + '.';
                }
            }
            return truncated;
        }
    }
    return text;
}

export async function generateContent(params: GenerateContentParams): Promise<OutputData> {
    const { mode, inputText, useSearchGrounding, isThinkingMode } = params;
    const selectedTags = 'selectedTags' in params ? (params as any).selectedTags : undefined;
    const prompt = generatePrompt(mode, inputText, selectedTags);
    
    const config: any = {};
    // Enable thinking mode for all modes when requested
    if (isThinkingMode) {
        // Use a reasonable thinking budget for better reasoning without overuse
        (config as any).thinking = { budgetTokens: 2048 };
    }
    
    // Proverb mode requires search, other modes can optionally use it.
    if (useSearchGrounding || mode === Mode.FIND_PROVERBS) {
        config.tools = [{ googleSearch: {} }];
    }

    return callWithProThenFlash(async (client, modelName) => {
        const response = await client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: config
        });

        const responseText = typeof (response as any).text === 'function'
            ? (response as any).text()
            : (response as any).text;

        if (!responseText) {
            throw new Error('پاسخی از مدل دریافت نشد. لطفاً دوباره تلاش کنید.');
        }

        let text: string = responseText;

        if (mode === Mode.GENERATE_HEADLINES) {
            try {
                const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonString) as string[];
            } catch (e) {
                console.error("Failed to parse headlines JSON:", e);
                const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return cleanedText.split('\n').filter(line => line.trim() !== '' && !['[',']'].includes(line.trim()));
            }
        } else if (mode === Mode.FIND_PROVERBS) {
            try {
                const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonString) as ProverbSuggestion[];
            } catch (e) {
                console.error("Failed to parse proverbs JSON:", e);
                throw new Error("پاسخ دریافت شده در قالب مورد انتظار نبود. لطفا دوباره تلاش کنید.");
            }
        } else if (mode === Mode.FIND_POEMS) {
            try {
                const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(jsonString) as PoemSuggestion[];
            } catch (e) {
                console.error("Failed to parse poems JSON:", e);
                throw new Error("پاسخ دریافت شده در قالب مورد انتظار نبود. لطفا دوباره تلاش کنید.");
            }
        }

        // Apply line limit for WRITE_ARTICLE mode
        text = enforceLineLimit(text, mode, inputText);
        return text;
    });
}

// Streaming version for text-based modes
export async function generateContentStream(
    params: GenerateContentParams,
    onChunk: (chunk: string) => void
): Promise<OutputData> {
    const { mode, inputText, useSearchGrounding, isThinkingMode } = params;
    const selectedTags = 'selectedTags' in params ? (params as any).selectedTags : undefined;

    // Only use streaming for text-based modes
    if (mode !== Mode.WRITE_ARTICLE && mode !== Mode.REWRITE_TEXT) {
        return generateContent(params);
    }

    const ai = getAiClient();
    const modelName = forceFlashForAllCalls ? FALLBACK_MODEL : PRIMARY_MODEL;
    const prompt = generatePrompt(mode, inputText, selectedTags);
    
    const config: any = {};

    if (isThinkingMode) {
        (config as any).thinking = { budgetTokens: 2048 };
    }
    
    if (useSearchGrounding) {
        config.tools = [{ googleSearch: {} }];
    }

    const response = await ai.models.generateContentStream({
        model: modelName,
        contents: prompt,
        config: config
    });

    let fullText = '';
    for await (const chunk of response) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        onChunk(fullText); // Send accumulated text
    }

    // Apply line limit for WRITE_ARTICLE mode
    fullText = enforceLineLimit(fullText, mode, inputText);
    return fullText;
}

// Refinement function for post-output editing
export async function refineContent(params: RefineContentParams): Promise<string> {
    const { originalInput, currentOutput, refinementInstruction } = params;
    const prompt = `تو یک دستیار آشپزخانه و نویسنده رسپی فارسی هستی که کمک می‌کند متن‌های مربوط به غذا و آشپزی بهتر و واضح‌تر شوند.

درخواست اولیه مامان‌جون: "${originalInput}"

متن فعلی که تولید شده:
"""
${currentOutput}
"""

درخواست اصلاح مامان‌جون: "${refinementInstruction}"

لطفاً متن را با توجه به این درخواست اصلاح کن. خروجی باید:
- به زبان فارسی روان و خودمانی اما محترمانه باشد
- درخواست اصلاح را دقیقاً رعایت کند (مثلاً کوتاه‌تر، مفصل‌تر، ساده‌تر، رسمی‌تر و ...)
- اگر موضوع درباره رسپی/غذاست، حتماً مراحل و مقادیر را واضح نگه دارد
- در صورتی که درخواست اصلاح مربوط به طول متن نیست، طول متن را تقریباً حفظ کند
- منسجم و یکپارچه باشد
- از نوشتن جملات یا بخش‌های انگلیسی خودداری کن، مگر در نام‌های خاص یا اگر خود کاربر صراحتاً متن انگلیسی خواسته باشد

فقط متن نهایی را برگردان، بدون توضیح اضافی.`;

    return callWithProThenFlash(async (client, modelName) => {
        const response = await client.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {}
        });

        const responseText = typeof (response as any).text === 'function'
            ? (response as any).text()
            : (response as any).text;

        if (!responseText) {
            throw new Error('پاسخی از مدل دریافت نشد. لطفاً دوباره تلاش کنید.');
        }

        return responseText;
    });
}

// Streaming refinement
export async function refineContentStream(
    params: RefineContentParams,
    onChunk: (chunk: string) => void
): Promise<string> {
    const { originalInput, currentOutput, refinementInstruction } = params;
    const prompt = `تو یک دستیار آشپزخانه و نویسنده رسپی فارسی هستی که کمک می‌کند متن‌های مربوط به غذا و آشپزی بهتر و واضح‌تر شوند.

درخواست اولیه مامان‌جون: "${originalInput}"

متن فعلی که تولید شده:
"""
${currentOutput}
"""

درخواست اصلاح مامان‌جون: "${refinementInstruction}"

لطفاً متن را با توجه به این درخواست اصلاح کن. خروجی باید:
- به زبان فارسی روان و خودمانی اما محترمانه باشد
- درخواست اصلاح را دقیقاً رعایت کند (مثلاً کوتاه‌تر، مفصل‌تر، ساده‌تر، رسمی‌تر و ...)
- اگر موضوع درباره رسپی/غذاست، حتماً مراحل و مقادیر را واضح نگه دارد
- در صورتی که درخواست اصلاح مربوط به طول متن نیست، طول متن را تقریباً حفظ کند
- منسجم و یکپارچه باشد
- از نوشتن جملات یا بخش‌های انگلیسی خودداری کن، مگر در نام‌های خاص یا اگر خود کاربر صراحتاً متن انگلیسی خواسته باشد

فقط متن نهایی را برگردان، بدون توضیح اضافی.`;

    const ai = getAiClient();

    const modelName = forceFlashForAllCalls ? FALLBACK_MODEL : PRIMARY_MODEL;

    const response = await ai.models.generateContentStream({
        model: modelName,
        contents: prompt,
        config: {}
    });

    let fullText = '';
    for await (const chunk of response) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        onChunk(fullText);
    }

    return fullText;
}

// Chat functionality
export async function sendChatMessage(
    messages: ChatMessage[],
    isThinkingMode?: boolean
): Promise<string> {
    const systemPrompt = `تو نقش یک دستیار آشپزخانه مهربان به اسم «ChefMom» را بازی می‌کنی که با «مامان‌جون» صحبت می‌کند.

در تمام پاسخ‌ها:
- مخاطب را «مامان‌جون» یا «مامان جون» صدا بزن
- محترمانه و مهربان باش، اما کاملاً خودمانی و صمیمی
- جواب‌ها را تا حد امکان کوتاه، کاربردی و سرراست بنویس؛ مخصوصاً وقتی صحبت از غذا و رسپی است
- هر وقت می‌توانی، نکته‌ها و ترفندهای آشپزیِ ساده و قابل اجرا برای مامان‌جون اضافه کن
- از جملات محاوره‌ایِ مؤدبانه استفاده کن، نه خیلی رسمی و خشک
- همه پاسخ‌ها باید ۱۰۰٪ به زبان فارسی روان باشند؛ از انگلیسی فقط برای نام‌های خاص یا اگر خود مامان‌جون بخواهد استفاده کن

اگر متنی را به عنوان «رسپی پیشنهادی» یا «متن پیشنهادی برای استفاده در جای دیگری» تولید می‌کنی، آن بخش را دقیقاً بین این دو خط قرار بده:
---متن پیشنهادی شروع---
[فقط خودِ متن پیشنهادی، بدون توضیح اضافی]
---متن پیشنهادی پایان---

بقیه صحبت‌های عادی چت باید بیرون از این محدوده باشد.`;

    // Build conversation history (label user explicitly as "مامان‌جون" و دستیار به عنوان "ChefMom")
    let conversationText = systemPrompt + '\n\n';
    messages.forEach(msg => {
        const speaker = msg.role === 'user' ? 'مامان‌جون' : 'ChefMom';
        conversationText += `${speaker}: ${msg.content}\n\n`;
    });
    conversationText += 'ChefMom:';

    const config: any = {};
    if (isThinkingMode) {
        (config as any).thinking = { budgetTokens: 1024 };
    }

    return callWithProThenFlash(async (client, modelName) => {
        const response = await client.models.generateContent({
            model: modelName,
            contents: conversationText,
            config
        });

        const responseText = typeof (response as any).text === 'function'
            ? (response as any).text()
            : (response as any).text;

        if (!responseText) {
            throw new Error('پاسخی از مدل دریافت نشد. لطفاً دوباره تلاش کنید.');
        }

        return responseText;
    });
}

// Generate short personal message (for welcome popup or header subtitle)
export async function generatePersonalMessage(type: 'welcome' | 'subtitle'): Promise<string> {
    const prompts = {
        welcome: `تو نقش یک دستیار آشپزخانه مهربان به اسم «ChefMom» هستی که مستقیم با «مامان‌جون» حرف می‌زند. یک جمله خیلی کوتاه و صمیمی (حداکثر ۱۰-۱۵ کلمه) برای خوشامدگویی به مامان‌جون بنویس. حتماً لحن خودمانی و گرم باشد. خروجی باید کاملاً به زبان فارسی باشد و از نوشتن کلمات یا عبارات انگلیسی خودداری کن. مثال: "مامان‌جون سلام! بیا ببینیم امروز چی بپزیم" یا "مامان جون عزیز، من اینجام که کمکت کنم" - فقط یک جمله فارسی بنویس، بدون توضیح اضافی.`,
        subtitle: `تو نقش یک دستیار آشپزخانه مهربان به اسم «ChefMom» هستی. یک جمله خیلی کوتاه و صمیمی (حداکثر ۱۰-۱۵ کلمه) برای نوشتن در بالای صفحه بنویس که حس همراهی در آشپزخانه و کمک به مامان‌جون را منتقل کند. خروجی باید کاملاً به زبان فارسی باشد و از نوشتن کلمات یا عبارات انگلیسی خودداری کن. مثال: "کمک‌آشپز همیشه کنار مامان‌جون" یا "هر روز یک ایده تازه برای سفرهٔ خونه" - فقط یک جمله فارسی بنویس، بدون توضیح اضافی.`
    };
    const modelName = FALLBACK_MODEL;

    const response = await withClientForModel(modelName, async (client, selectedModel) => {
        const res = await client.models.generateContent({
            model: selectedModel,
            contents: prompts[type],
            config: {}
        });

        const responseText = typeof (res as any).text === 'function'
            ? (res as any).text()
            : (res as any).text;

        if (!responseText) {
            throw new Error('پاسخی از مدل دریافت نشد. لطفاً دوباره تلاش کنید.');
        }

        return responseText as string;
    });

    if (!response) {
        return type === 'welcome' ? 'مامان‌جون سلام! بیا ببینیم امروز چی بپزیم' : 'کمک‌آشپز همیشه کنار مامان‌جون';
    }

    return (response as string).trim();
}

// Streaming chat
export async function sendChatMessageStream(
    messages: ChatMessage[],
    onChunk: (chunk: string) => void,
    isThinkingMode?: boolean
): Promise<string> {
    const systemPrompt = `تو نقش یک دستیار آشپزخانه مهربان به اسم «ChefMom» را بازی می‌کنی که با «مامان‌جون» صحبت می‌کند.

در تمام پاسخ‌ها:
- مخاطب را «مامان‌جون» یا «مامان جون» صدا بزن
- محترمانه و مهربان باش، اما کاملاً خودمانی و صمیمی
- جواب‌ها را تا حد امکان کوتاه، کاربردی و سرراست بنویس؛ مخصوصاً وقتی صحبت از غذا و رسپی است
- هر وقت می‌توانی، نکته‌ها و ترفندهای آشپزیِ ساده و قابل اجرا برای مامان‌جون اضافه کن
- از جملات محاوره‌ایِ مؤدبانه استفاده کن، نه خیلی رسمی و خشک
- همه پاسخ‌ها باید ۱۰۰٪ به زبان فارسی روان باشند؛ از انگلیسی فقط برای نام‌های خاص یا اگر خود مامان‌جون بخواهد استفاده کن

اگر متنی را به عنوان «رسپی پیشنهادی» یا «متن پیشنهادی برای استفاده در جای دیگری» تولید می‌کنی، آن بخش را دقیقاً بین این دو خط قرار بده:
---متن پیشنهادی شروع---
[فقط خودِ متن پیشنهادی، بدون توضیح اضافی]
---متن پیشنهادی پایان---

بقیه صحبت‌های عادی چت باید بیرون از این محدوده باشد.`;

    // Build conversation history (label user explicitly as "مامان‌جون" و دستیار به عنوان "ChefMom")
    let conversationText = systemPrompt + '\n\n';
    messages.forEach(msg => {
        const speaker = msg.role === 'user' ? 'مامان‌جون' : 'ChefMom';
        conversationText += `${speaker}: ${msg.content}\n\n`;
    });
    conversationText += 'ChefMom:';

    const config: any = {};
    if (isThinkingMode) {
        (config as any).thinking = { budgetTokens: 1024 };
    }

    const ai = getAiClient();

    const modelName = forceFlashForAllCalls ? FALLBACK_MODEL : PRIMARY_MODEL;

    const response = await ai.models.generateContentStream({
        model: modelName,
        contents: conversationText,
        config
    });

    let fullText = '';
    for await (const chunk of response) {
        const chunkText = chunk.text || '';
        fullText += chunkText;
        onChunk(fullText);
    }

    return fullText;
}
