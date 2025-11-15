import { ArticleIcon, BookIcon, EditIcon, FormatQuoteIcon, HeadlineIcon } from './components/icons';
import { Mode, ModeOption, PromptTagGroup } from './types';

// ChefMom modes: all names are cooking-focused while reusing the existing Mode enum values.
// UI texts are what your mom will actually see.
export const MODES: ModeOption[] = [
  {
    id: Mode.GENERATE_HEADLINES,
    title: 'ایده رسپی سریع',
    description: 'چند غذای ساده و سریع بر اساس مواد و وقتی که داری پیشنهاد می‌دهد.',
    icon: HeadlineIcon,
    placeholder: 'مثلاً: سینه مرغ، قارچ، پنیر... یا «شام سریع برای دو نفر»',
    supportsThinkingMode: true,
    supportsSearchGrounding: true,
  },
  {
    id: Mode.FIND_POEMS,
    title: 'برنامه هفتگی غذا',
    description: 'برای یک هفته، منوی غذای خونگی و متنوع برای خانواده می‌چیند.',
    icon: BookIcon,
    placeholder: 'مثلاً: منوی ساده و خونگی برای یک هفته برای ۴ نفر',
    supportsThinkingMode: true,
    supportsSearchGrounding: true,
  },
  {
    id: Mode.WRITE_ARTICLE,
    title: 'رسپی کامل مرحله‌به‌مرحله',
    description: 'دستور پخت کامل با مواد، مقدار دقیق، مراحل و نکته‌های کلیدی می‌نویسد.',
    icon: ArticleIcon,
    placeholder: 'مثلاً: قیمه نذری برای ۱۰ نفر، یا لازانیا با فر خانگی',
    supportsThinkingMode: true,
    supportsSearchGrounding: true,
  },
  {
    id: Mode.REWRITE_TEXT,
    title: 'سالم‌ترش کن',
    description: 'یک غذای دلخواهت را می‌گیرد و نسخه سالم‌تر و سبک‌ترش را پیشنهاد می‌دهد.',
    icon: EditIcon,
    placeholder: 'مثلاً: قرمه‌سبزی کم‌چرب برای کسی که چربی و فشار خون دارد',
    supportsThinkingMode: true,
    supportsSearchGrounding: false,
  },
  {
    id: Mode.FIND_PROVERBS,
    title: 'نکته‌ها و ترفندهای آشپزخانه',
    description: 'نکته‌های ریز و درشت برای بهتر شدن غذا، نگهداری مواد و تمیزکاری.',
    icon: FormatQuoteIcon,
    placeholder: 'مثلاً: نکته برای فریز کردن سبزی، یا برنج دونه‌دونه و قدکشیده',
    supportsThinkingMode: true,
    supportsSearchGrounding: true,
  },
];

// Tag definitions for each mode – all tailored for everyday Farsi cooking.
export const MODE_TAGS: Record<Mode, PromptTagGroup[]> = {
  [Mode.GENERATE_HEADLINES]: [
    {
      id: 'quick_meal_type',
      label: 'نوع وعده',
      tags: [
        {
          id: 'quick_breakfast',
          label: 'صبحانه ساده',
          description: 'ایده برای صبحانه‌های سریع و خونگی',
          promptFragment: 'ایده‌های رسپی را فقط برای صبحانه‌های ساده، خونگی و سریع پیشنهاد بده.',
        },
        {
          id: 'quick_lunch',
          label: 'ناهار روزمره',
          description: 'ناهار معمولی برای خانه',
          promptFragment: 'غذاها را برای ناهار روزمرهٔ خانواده پیشنهاد بده، نه خیلی مجلسی و نه فست‌فود.',
        },
        {
          id: 'quick_dinner',
          label: 'شام سبک',
          description: 'شام سبک و کم‌حجم',
          promptFragment: 'غذاها را سبک و کم‌حجم پیشنهاد بده تا برای شام مناسب باشند.',
        },
        {
          id: 'quick_snack',
          label: 'میان‌وعده و عصرانه',
          description: 'میان‌وعده یا عصرانه ساده',
          promptFragment: 'ایده‌ها را برای میان‌وعده، عصرانه یا خوراکی‌های سبک بین وعده‌ها پیشنهاد بده.',
        },
      ],
    },
    {
      id: 'quick_time',
      label: 'مدت زمان',
      tags: [
        {
          id: 'time_15',
          label: 'آماده در ۱۵ دقیقه',
          description: 'خیلی سریع',
          promptFragment: 'فقط غذاهایی را پیشنهاد بده که در حدود ۱۵ دقیقه آماده می‌شوند.',
        },
        {
          id: 'time_30',
          label: 'آماده در ۳۰ دقیقه',
          description: 'سریع ولی معمولی',
          promptFragment: 'غذاهایی را پیشنهاد بده که حداکثر در حدود ۳۰ دقیقه آماده شوند.',
        },
        {
          id: 'time_relaxed',
          label: 'وقت دارم، مهم نیست',
          description: 'بدون محدودیت زمان',
          promptFragment: 'از محدودیت زمان صرف‌نظر کن و روی خوشمزه بودن و سادگی تمرکز کن.',
        },
      ],
    },
    {
      id: 'quick_diet',
      label: 'سبک تغذیه',
      tags: [
        {
          id: 'diet_light',
          label: 'کم‌چرب و سبک',
          description: 'غذاهای سبک و کم‌چرب',
          promptFragment: 'غذاها را تا حد امکان کم‌چرب و سبک پیشنهاد بده، مناسب رژیم ملایم.',
        },
        {
          id: 'diet_vegetarian',
          label: 'گیاه‌خواری',
          description: 'بدون گوشت',
          promptFragment: 'فقط غذاهای بدون گوشت قرمز و مرغ پیشنهاد بده؛ می‌توانی از حبوبات و سبزیجات استفاده کنی.',
        },
        {
          id: 'diet_family',
          label: 'خانوادگی و خونگی',
          description: 'سلیقهٔ معمول خانواده ایرانی',
          promptFragment: 'غذاها را مطابق سلیقهٔ معمول خانواده‌های ایرانی و برای سفرهٔ خونگی پیشنهاد بده.',
        },
      ],
    },
  ],

  [Mode.FIND_POEMS]: [
    {
      id: 'weekly_family',
      label: 'ترکیب خانواده',
      tags: [
        {
          id: 'weekly_two',
          label: 'دو نفره',
          description: 'خانهٔ دونفره',
          promptFragment: 'برنامهٔ غذایی را برای یک خانوادهٔ دو نفره بچین.',
        },
        {
          id: 'weekly_four',
          label: 'چهارنفره رایج',
          description: 'پدر، مادر، دو فرزند',
          promptFragment: 'برنامهٔ غذایی را برای خانوادهٔ چهارنفرهٔ معمول (پدر، مادر و دو فرزند) تنظیم کن.',
        },
        {
          id: 'weekly_many',
          label: 'خانواده پرجمعیت',
          description: 'بیش از ۵ نفر',
          promptFragment: 'برنامهٔ غذایی را طوری طراحی کن که برای خانوادهٔ پرجمعیت با بیش از ۵ نفر جواب بدهد.',
        },
      ],
    },
    {
      id: 'weekly_style',
      label: 'سبک منو',
      tags: [
        {
          id: 'weekly_homey',
          label: 'کاملاً خونگی و ایرانی',
          description: 'غذاهای ایرانی کلاسیک',
          promptFragment: 'منو را با تأکید بر غذاهای خونگی و ایرانی کلاسیک بچین (مثل خورشت‌ها، پلوها، خوراک‌های ساده).',
        },
        {
          id: 'weekly_mixed',
          label: 'ترکیب ایرانی و فرنگی',
          description: 'مقداری تنوع خارجی',
          promptFragment: 'در برنامه، ترکیب متعادلی از غذاهای ایرانی و چند غذای فرنگی ساده قرار بده.',
        },
        {
          id: 'weekly_diet',
          label: 'رژیمی و سبک',
          description: 'کم‌کالری',
          promptFragment: 'منو را تا حد امکان سبک و کم‌کالری طراحی کن، با تأکید بر سبزیجات، کبابی و بخارپز.',
        },
      ],
    },
    {
      id: 'weekly_budget',
      label: 'بودجه خرید',
      tags: [
        {
          id: 'budget_low',
          label: 'کم‌هزینه',
          description: 'حداکثر صرفه‌جویی',
          promptFragment: 'برنامهٔ غذایی را کم‌هزینه طراحی کن و بیشتر از مواد ساده و ارزان مثل حبوبات و سیب‌زمینی استفاده کن.',
        },
        {
          id: 'budget_normal',
          label: 'معمولی',
          description: 'بودجه متوسط',
          promptFragment: 'منو را با بودجهٔ متوسط طراحی کن؛ نه خیلی صرفه‌جویی شدید، نه خیلی مجلسی.',
        },
        {
          id: 'budget_guest',
          label: 'در حد مهمان',
          description: 'کمی مجلسی‌تر',
          promptFragment: 'منو را کمی مجلسی‌تر طراحی کن طوری که اگر مهمان هم آمد، در هفته دو سه غذای ویژه داشته باشی.',
        },
      ],
    },
  ],

  [Mode.WRITE_ARTICLE]: [
    {
      id: 'recipe_detail',
      label: 'سطح جزئیات رسپی',
      tags: [
        {
          id: 'detail_beginner',
          label: 'برای کسی که تازه آشپزی شروع کرده',
          description: 'توضیح خیلی ریز و قدم‌به‌قدم',
          promptFragment: 'دستور پخت را طوری بنویس که برای فرد مبتدی کاملاً قابل فهم باشد؛ همه چیز را قدم‌به‌قدم و با توضیح واضح بگو.',
        },
        {
          id: 'detail_normal',
          label: 'برای مامان با تجربهٔ متوسط',
          description: 'توضیح معمولی',
          promptFragment: 'دستور پخت را با توضیح معمولی بنویس؛ فرض کن مامان تجربهٔ خوبی دارد و لازم نیست خیلی چیزها را از صفر توضیح بدهی.',
        },
        {
          id: 'detail_pro',
          label: 'خیلی خلاصه برای حرفه‌ای',
          description: 'فقط نکات کلیدی',
          promptFragment: 'دستور را کوتاه و خلاصه بنویس و فقط نکات کلیدی و تفاوت‌های مهم را بگو؛ مناسب کسی که کاملاً حرفه‌ای است.',
        },
      ],
    },
    {
      id: 'recipe_tools',
      label: 'امکانات آشپزخانه',
      tags: [
        {
          id: 'tools_no_oven',
          label: 'بدون فر',
          description: 'فقط اجاق گاز',
          promptFragment: 'دستور پخت را طوری طراحی کن که نیازی به فر نداشته باشد و فقط با اجاق گاز و قابلمه/ماهیتابه قابل اجرا باشد.',
        },
        {
          id: 'tools_simple',
          label: 'وسایل معمول خانه',
          description: 'بدون ابزار حرفه‌ای',
          promptFragment: 'فرض کن فقط وسایل معمولی آشپزخانه در دسترس است؛ از دستگاه‌ها و ابزار خیلی تخصصی استفاده نکن.',
        },
        {
          id: 'tools_full',
          label: 'همه‌چیز در دسترسه',
          description: 'می‌توانی از فر و فرایر استفاده کنی',
          promptFragment: 'می‌توانی در دستور، از فر، سرخ‌کن بدون روغن و سایر ابزارهای متداول هم استفاده کنی اگر لازم بود.',
        },
      ],
    },
    {
      id: 'recipe_result',
      label: 'نتیجهٔ مورد انتظار',
      tags: [
        {
          id: 'result_family',
          label: 'رضایت خانواده',
          description: 'سلیقهٔ همه را تا حدی پوشش بده',
          promptFragment: 'در دستور پخت، به سلیقهٔ معمول اعضای خانواده فکر کن و طعم‌ها را طوری تنظیم کن که اکثراً خوششان بیاید.',
        },
        {
          id: 'result_guest',
          label: 'برای وقتی مهمان داریم',
          description: 'شیک‌تر و مجلسی‌تر',
          promptFragment: 'دستور را طوری تنظیم کن که برای مهمانی مناسب باشد؛ ظاهر غذا، تزئین و سرو را هم توضیح بده.',
        },
        {
          id: 'result_mealprep',
          label: 'برای فریز و مصرف چندباره',
          description: 'قابل فریز و گرم‌کردن مجدد',
          promptFragment: 'دستور را طوری طراحی کن که بشود بخشی از غذا را فریز کرد و بعداً به راحتی گرم و سرو کرد؛ نکات مربوط به این کار را توضیح بده.',
        },
      ],
    },
  ],

  [Mode.REWRITE_TEXT]: [
    {
      id: 'health_goal',
      label: 'هدف سلامتی',
      tags: [
        {
          id: 'goal_low_fat',
          label: 'کاهش چربی',
          description: 'کم‌کردن روغن و سرخ‌کردنی',
          promptFragment: 'غذا را طوری بازطراحی کن که تا حد ممکن چربی و سرخ‌کردنی در آن کم شود، بدون این‌که خیلی بی‌مزه بشود.',
        },
        {
          id: 'goal_low_salt',
          label: 'کاهش نمک',
          description: 'مناسب فشار خون',
          promptFragment: 'نسخهٔ جدید غذا را طوری تنظیم کن که برای کسی که فشار خون دارد مناسب باشد و نمک تا حد امکان کم شود.',
        },
        {
          id: 'goal_low_calorie',
          label: 'کم‌کالری برای لاغری',
          description: 'کاهش کالری کلی',
          promptFragment: 'غذا را با تمرکز بر کاهش کالری کلی بازطراحی کن؛ جایگزین‌های سبزیجاتی و پروتئین کم‌چرب پیشنهاد بده.',
        },
      ],
    },
    {
      id: 'health_restrictions',
      label: 'محدودیت غذایی',
      tags: [
        {
          id: 'restrict_diabetes',
          label: 'مناسب دیابتی',
          description: 'کنترل قند',
          promptFragment: 'نسخهٔ جدید غذا را طوری طراحی کن که برای فرد دیابتی مناسب باشد و روی کنترل قند خون تمرکز داشته باشد.',
        },
        {
          id: 'restrict_no_dairy',
          label: 'بدون لبنیات',
          description: 'حذف شیر و پنیر و ...',
          promptFragment: 'تا حد امکان از لبنیات مثل شیر، خامه و پنیر در نسخهٔ جدید استفاده نکن و جایگزین‌های مناسب پیشنهاد بده.',
        },
        {
          id: 'restrict_gluten_free',
          label: 'تقریباً بدون گلوتن',
          description: 'برای کسی که نباید نان و آرد زیاد بخورد',
          promptFragment: 'جایگزین‌هایی برای نان و آرد گندم پیشنهاد بده تا غذا تا حد ممکن کم‌گلوتن باشد.',
        },
      ],
    },
    {
      id: 'health_style',
      label: 'سبک پخت',
      tags: [
        {
          id: 'style_baked',
          label: 'بیشتر فر و گریل',
          description: 'کم‌سرخ‌کردن',
          promptFragment: 'در نسخهٔ جدید، تا جای ممکن از فر، گریل و بخارپز استفاده کن و سرخ‌کردن را کم کن.',
        },
        {
          id: 'style_one_pot',
          label: 'کم ظرف‌شویی (یک قابلمه)',
          description: 'ظرف کمتر، زحمت کمتر',
          promptFragment: 'رسپی سالم‌تر را طوری طراحی کن که تا حد امکان با یک قابلمه یا یک تابه انجام شود و ظرف‌شویی کم‌تر شود.',
        },
      ],
    },
  ],

  [Mode.FIND_PROVERBS]: [
    {
      id: 'tips_topic',
      label: 'موضوع نکته‌ها',
      tags: [
        {
          id: 'tips_storage',
          label: 'نگهداری مواد غذایی',
          description: 'فریز، یخچال، ماندگاری',
          promptFragment: 'نکته‌ها را دربارهٔ نگهداری بهتر مواد غذایی (در یخچال، فریزر و بیرون) بنویس.',
        },
        {
          id: 'tips_flavor',
          label: 'خوش‌طعم‌تر کردن غذا',
          description: 'ادویه، طعم‌دهنده‌ها، مزه نهایی',
          promptFragment: 'تمرکز نکته‌ها روی خوش‌طعم‌تر کردن غذا باشد؛ مثل استفادهٔ درست از ادویه‌ها، طعم‌دهنده‌ها و تنظیم مزهٔ نهایی.',
        },
        {
          id: 'tips_cleanup',
          label: 'کم کردن زحمت تمیزکاری',
          description: 'کمتر کثیف شدن آشپزخانه',
          promptFragment: 'نکته‌ها را طوری بنویس که به کم شدن زحمت تمیزکاری و شستن ظرف‌ها کمک کنند.',
        },
      ],
    },
    {
      id: 'tips_level',
      label: 'مخاطب نکته‌ها',
      tags: [
        {
          id: 'tips_newbie',
          label: 'برای تازه‌کارها',
          description: 'خیلی پایه و ساده',
          promptFragment: 'نکته‌ها را بسیار ساده و پایه بنویس، مناسب کسی که تازه آشپزی را شروع کرده.',
        },
        {
          id: 'tips_mom',
          label: 'برای مامان با تجربه',
          description: 'نکته‌های ریز و حرفه‌ای',
          promptFragment: 'نکته‌ها را طوری بنویس که حتی برای مامانی که سال‌ها آشپزی کرده هم ریز و کاربردی و تازه باشد.',
        },
      ],
    },
  ],
};
import { ArticleIcon, BookIcon, EditIcon, FormatQuoteIcon, HeadlineIcon } from './components/icons';
import { Mode, ModeOption, PromptTagGroup } from './types';

// Legacy Farsi writing assistant modes (unused in ChefMom, kept only for reference)
export const LEGACY_MODES_WRITING: ModeOption[] = [
  {
    id: Mode.GENERATE_HEADLINES,
    title: 'سازنده عنوان',
    description: 'ایجاد عناوین جذاب برای مقالات و پست‌ها',
    icon: HeadlineIcon,
    placeholder: 'موضوع مقاله خود را وارد کنید...',
    supportsThinkingMode: true,
    supportsSearchGrounding: true,
  },
  {
    id: Mode.FIND_POEMS,
    title: 'جستجوی شعر',
    description: 'پیدا کردن اشعار فارسی بر اساس موضوع',
    icon: BookIcon,
    placeholder: 'موضوعی مانند "بهار" یا "عشق" را وارد کنید...',
    supportsThinkingMode: true,
    supportsSearchGrounding: true,
  },
  {
    id: Mode.WRITE_ARTICLE,
    title: 'نویسنده مقاله',
    description: 'تولید متن ادبی منسجم در حدود ۲۵ خط (در صورت درخواست طولانی، بیشتر)',
    icon: ArticleIcon,
    placeholder: 'موضوع مقاله را برای نوشتن وارد کنید...',
    supportsThinkingMode: true,
    supportsSearchGrounding: true,
  },
  {
    id: Mode.REWRITE_TEXT,
    title: 'بازنویسی متن',
    description: 'بهبود و بازنویسی متون برای وضوح و جذابیت بیشتر',
    icon: EditIcon,
    placeholder: 'متنی را که می‌خواهید بازنویسی شود اینجا قرار دهید...',
    supportsThinkingMode: true,
    supportsSearchGrounding: false,
  },
  {
    id: Mode.FIND_PROVERBS,
    title: 'گوهر مازنی',
    description: 'یافتن ضرب‌المثل‌های مازندرانی (گویش مازنی) مرتبط با موضوعات',
    icon: FormatQuoteIcon,
    placeholder: 'موضوعی مانند "صبر" یا "دوستی" را وارد کنید...',
    supportsThinkingMode: true,
    supportsSearchGrounding: true, // This mode must use search grounding
  },
];

// Professional tag definitions for each mode - tailored for a professional Farsi writer (legacy, unused in ChefMom)
export const LEGACY_MODE_TAGS_WRITING: Record<Mode, PromptTagGroup[]> = {
  [Mode.GENERATE_HEADLINES]: [
    {
      id: 'headline_style',
      label: 'سبک عنوان',
      tags: [
        {
          id: 'headline_informative',
          label: 'اطلاع‌رسانی مستقیم',
          description: 'عنوان خبری و مستقیم',
          promptFragment: 'عنوان‌ها باید به سبک خبری و اطلاع‌رسانی باشند، واضح و بدون ابهام، مثل عناوین روزنامه‌های جدی'
        },
        {
          id: 'headline_literary',
          label: 'ادبی و استعاره‌محور',
          description: 'عنوان با نثر ادبی',
          promptFragment: 'عنوان‌ها را با نثر ادبی، استعاره‌های زیبا و کنایه‌های ظریف بنویس، مناسب برای مجلات فرهنگی و ادبی'
        },
        {
          id: 'headline_question',
          label: 'پرسشی و تأمل‌برانگیز',
          description: 'عنوان به شکل پرسش',
          promptFragment: 'عنوان‌ها را به صورت پرسش‌های تأمل‌برانگیز و جذاب بنویس که خواننده را به فکر کردن وادار کنند'
        },
        {
          id: 'headline_list',
          label: 'فهرست‌محور',
          description: 'عنوان با فرمت لیست',
          promptFragment: 'عنوان‌ها را به سبک فهرست‌وار بنویس (مثلاً "۵ راه برای..."، "۱۰ نکتهٔ کلیدی...")، مناسب برای محتوای آموزشی'
        }
      ]
    },
    {
      id: 'headline_audience',
      label: 'مخاطب و رسانه',
      tags: [
        {
          id: 'audience_newspaper',
          label: 'روزنامه جدی',
          description: 'برای مطبوعات',
          promptFragment: 'عنوان‌ها مناسب روزنامه‌های جدی و خبری باشند، با لحن رسمی و حرفه‌ای'
        },
        {
          id: 'audience_magazine',
          label: 'مجله فرهنگی',
          description: 'برای نشریات فرهنگی',
          promptFragment: 'عنوان‌ها مناسب مجلات فرهنگی و تحلیلی باشند، با عمق بیشتر و لحن تأملی'
        },
        {
          id: 'audience_social',
          label: 'شبکه‌های اجتماعی',
          description: 'برای سوشال مدیا',
          promptFragment: 'عنوان‌ها جذاب، کوتاه و مناسب شبکه‌های اجتماعی باشند، با قدرت ویرال شدن بالا'
        },
        {
          id: 'audience_academic',
          label: 'مخاطب تخصصی',
          description: 'برای محیط دانشگاهی',
          promptFragment: 'عنوان‌ها با لحن علمی و دانشگاهی، مناسب برای مقالات تحقیقاتی و تخصصی'
        }
      ]
    },
    {
      id: 'headline_tone',
      label: 'لحن',
      tags: [
        {
          id: 'tone_formal',
          label: 'رسمی و جدی',
          description: 'لحن رسمی',
          promptFragment: 'لحن عنوان‌ها کاملاً رسمی، جدی و بی‌طرفانه باشد'
        },
        {
          id: 'tone_inspiring',
          label: 'الهام‌بخش',
          description: 'انگیزشی و مثبت',
          promptFragment: 'عنوان‌ها الهام‌بخش، انگیزشی و پر از امید باشند'
        },
        {
          id: 'tone_critical',
          label: 'انتقادی و تحلیلی',
          description: 'نقادانه',
          promptFragment: 'عنوان‌ها با لحن انتقادی، تحلیلی و پرسشگر باشند'
        },
        {
          id: 'tone_emotional',
          label: 'احساسی و تأثیرگذار',
          description: 'عاطفی',
          promptFragment: 'عنوان‌ها احساسی، تأثیرگذار و با قدرت جذب عاطفی بالا باشند'
        }
      ]
    }
  ],

  [Mode.FIND_POEMS]: [
    {
      id: 'poem_form',
      label: 'قالب شعری',
      tags: [
        {
          id: 'form_ghazal',
          label: 'غزل',
          description: 'شعر غزل',
          promptFragment: 'فقط اشعار غزل انتخاب کن - اشعاری با قالب غزل و با بیت‌های عاشقانه یا عارفانه'
        },
        {
          id: 'form_rubai',
          label: 'رباعی',
          description: 'شعر چهار مصرعی',
          promptFragment: 'اشعار را از رباعیات انتخاب کن - اشعار کوتاه چهار مصرعی با مفهوم عمیق'
        },
        {
          id: 'form_masnavi',
          label: 'مثنوی',
          description: 'ابیات مثنوی',
          promptFragment: 'از ابیات مثنوی‌ها انتخاب کن، مناسب برای داستان‌سرایی و آموزش اخلاقی'
        },
        {
          id: 'form_modern',
          label: 'شعر نو و سپید',
          description: 'شعر معاصر',
          promptFragment: 'اشعار معاصر و شعر نو (سپید) انتخاب کن، از شاعران نوگرا و مدرن'
        }
      ]
    },
    {
      id: 'poem_era',
      label: 'دوره و شاعر',
      tags: [
        {
          id: 'era_classic',
          label: 'کلاسیک (حافظ، سعدی، مولوی)',
          description: 'شعر کهن',
          promptFragment: 'ترجیحاً از شاعران کلاسیک بزرگ مانند حافظ، سعدی، مولوی، فردوسی و عطار انتخاب کن'
        },
        {
          id: 'era_contemporary',
          label: 'معاصر (شاملو، اخوان، فروغ)',
          description: 'شعر مدرن',
          promptFragment: 'از شاعران معاصر و مدرن مانند شاملو، اخوان ثالث، فروغ فرخزاد، سپهری انتخاب کن'
        },
        {
          id: 'era_mystic',
          label: 'عرفانی (مولوی، عطار، حافظ)',
          description: 'شعر صوفیانه',
          promptFragment: 'اشعار عرفانی و صوفیانه از شاعران بزرگ عارف مانند مولوی، عطار، حافظ و شبستری انتخاب کن'
        }
      ]
    },
    {
      id: 'poem_mood',
      label: 'حال و هوا',
      tags: [
        {
          id: 'mood_love',
          label: 'عاشقانه',
          description: 'شعر عشقی',
          promptFragment: 'اشعار عاشقانه و رمانتیک انتخاب کن، با مضمون عشق و محبت'
        },
        {
          id: 'mood_mystic',
          label: 'عارفانه و معنوی',
          description: 'شعر تأملی',
          promptFragment: 'اشعار عارفانه، معنوی و تأملی انتخاب کن، با مضامین عرفانی و فلسفی'
        },
        {
          id: 'mood_epic',
          label: 'حماسی و ملی',
          description: 'شعر پرشور',
          promptFragment: 'اشعار حماسی، میهنی و سرشار از شور و شوق انتخاب کن'
        },
        {
          id: 'mood_sad',
          label: 'غم‌انگیز و اندوهناک',
          description: 'شعر غمگین',
          promptFragment: 'اشعار غم‌انگیز، اندوهناک و با حال و هوای ملال و اندوه انتخاب کن'
        },
        {
          id: 'mood_hopeful',
          label: 'امیدبخش و مثبت',
          description: 'شعر روشن',
          promptFragment: 'اشعار امیدبخش، مثبت و سرشار از نور و روشنایی انتخاب کن'
        }
      ]
    },
    {
      id: 'poem_usage',
      label: 'کاربرد در متن',
      tags: [
        {
          id: 'usage_intro',
          label: 'برای مقدمه',
          description: 'آغاز مقاله',
          promptFragment: 'اشعاری انتخاب کن که برای مقدمه و آغاز مقاله مناسب باشند و زمینه‌ساز ورود به موضوع'
        },
        {
          id: 'usage_conclusion',
          label: 'برای جمع‌بندی',
          description: 'پایان مقاله',
          promptFragment: 'اشعاری انتخاب کن که برای جمع‌بندی و نتیجه‌گیری پایان مقاله مناسب باشند'
        },
        {
          id: 'usage_emphasis',
          label: 'برای تأکید میان متن',
          description: 'تقویت نکته',
          promptFragment: 'اشعاری انتخاب کن که برای تأکید و تقویت نکات کلیدی در میان متن مناسب باشند'
        }
      ]
    }
  ],

  [Mode.WRITE_ARTICLE]: [
    {
      id: 'article_tone',
      label: 'لحن و سبک نوشتاری',
      tags: [
        {
          id: 'tone_academic',
          label: 'رسمی - دانشگاهی',
          description: 'سبک علمی',
          promptFragment: 'متن را با لحن کاملاً رسمی و دانشگاهی بنویس، مناسب برای مقالات علمی و پژوهشی، با واژگان تخصصی و ساختار استدلالی محکم'
        },
        {
          id: 'tone_journalistic',
          label: 'روزنامه‌نگارانه',
          description: 'سبک خبری',
          promptFragment: 'متن را به سبک روزنامه‌نگاری بنویس - واضح، بی‌طرفانه، اطلاع‌رسان و با ساختار هرم معکوس (مهم‌ترین اطلاعات ابتدا)'
        },
        {
          id: 'tone_literary',
          label: 'ادبی و شاعرانه',
          description: 'نثر هنری',
          promptFragment: 'متن را با نثر ادبی، شاعرانه و هنری بنویس - استفاده از استعاره‌ها، تشبیهات زیبا، آرایه‌های ادبی و زبان روان و دلنشین'
        },
        {
          id: 'tone_friendly',
          label: 'صمیمی و محاوره‌ملایم',
          description: 'سبک دوستانه',
          promptFragment: 'متن را با لحن صمیمی، دوستانه و قابل ارتباط بنویس، با زبان ساده‌تر و نزدیک به گفتار (بدون خودمانی بیش از حد)'
        },
        {
          id: 'tone_analytical',
          label: 'تفسیری - تحلیلی',
          description: 'سبک تحلیلگرانه',
          promptFragment: 'متن را با رویکرد تحلیلی و تفسیری بنویس - بررسی عمیق موضوع، تحلیل علل و معلول‌ها، و ارائه دیدگاه‌های مختلف'
        }
      ]
    },
    {
      id: 'article_audience',
      label: 'مخاطب هدف',
      tags: [
        {
          id: 'audience_general',
          label: 'عموم مردم',
          description: 'همه مخاطبان',
          promptFragment: 'متن برای عموم مردم نوشته شود - با زبان ساده، واضح و قابل فهم، بدون اصطلاحات تخصصی پیچیده'
        },
        {
          id: 'audience_expert',
          label: 'متخصصان حوزه',
          description: 'مخاطب حرفه‌ای',
          promptFragment: 'متن برای متخصصان و کارشناسان حوزه نوشته شود - با عمق تخصصی، اصطلاحات فنی و بحث‌های پیشرفته'
        },
        {
          id: 'audience_student',
          label: 'دانشجویان',
          description: 'مخاطب دانشگاهی',
          promptFragment: 'متن برای دانشجویان و محققان نوشته شود - آموزنده، جامع و با ارجاعات علمی، در عین سادگی نسبی'
        },
        {
          id: 'audience_executive',
          label: 'مدیران و تصمیم‌گیران',
          description: 'مخاطب مدیریتی',
          promptFragment: 'متن برای مدیران و تصمیم‌گیران نوشته شود - مختصر، کاربردی، با تمرکز بر راهکارها و نتایج عملی'
        }
      ]
    },
    {
      id: 'article_structure',
      label: 'ساختار و روش',
      tags: [
        {
          id: 'structure_argumentative',
          label: 'استدلالی و نقدی',
          description: 'مقاله بحثی',
          promptFragment: 'ساختار متن استدلالی باشد - ارائه ادعا، دلایل، شواهد و نقد دیدگاه‌های مخالف'
        },
        {
          id: 'structure_descriptive',
          label: 'توصیفی - روایی',
          description: 'مقاله تشریحی',
          promptFragment: 'ساختار متن توصیفی و روایی باشد - شرح و بسط موضوع با جزئیات کامل، مانند یک داستان یا گزارش'
        },
        {
          id: 'structure_comparative',
          label: 'مقایسه‌ای',
          description: 'تطبیقی',
          promptFragment: 'ساختار متن مقایسه‌ای باشد - بررسی شباهت‌ها و تفاوت‌های دو یا چند موضوع در کنار هم'
        },
        {
          id: 'structure_problem_solution',
          label: 'مسئله - راه‌حل',
          description: 'حل مشکل',
          promptFragment: 'ساختار متن به شکل مسئله و راه‌حل باشد - ابتدا مشکل را شرح بده، سپس راهکارهای عملی ارائه کن'
        },
        {
          id: 'structure_narrative',
          label: 'روایت‌محور با مثال‌های داستانی',
          description: 'داستانی',
          promptFragment: 'متن را با رویکرد روایی و داستان‌گو بنویس - استفاده از مثال‌های ملموس، حکایات و داستان‌های واقعی'
        }
      ]
    },
    {
      id: 'article_depth',
      label: 'عمق پوشش',
      tags: [
        {
          id: 'depth_surface',
          label: 'سطحی و معرفی‌وار',
          description: 'مروری کلی',
          promptFragment: 'پوشش موضوع سطحی و معرفی‌وار باشد - یک نمای کلی و مرور اجمالی بدون عمق زیاد'
        },
        {
          id: 'depth_deep',
          label: 'تحلیلی عمیق',
          description: 'بررسی دقیق',
          promptFragment: 'پوشش موضوع عمیق و تحلیلی باشد - بررسی همه جوانب، تحلیل ریز و دقیق، و کاوش در لایه‌های پنهان'
        },
        {
          id: 'depth_historical',
          label: 'تمرکز بر جنبه تاریخی',
          description: 'نگاه گذشته‌نگر',
          promptFragment: 'تمرکز اصلی متن بر بُعد تاریخی موضوع باشد - بررسی ریشه‌ها، تحولات زمانی و سیر تاریخی'
        },
        {
          id: 'depth_aesthetic',
          label: 'تمرکز بر جنبه ادبی - زیباشناختی',
          description: 'نگاه هنری',
          promptFragment: 'تمرکز اصلی متن بر بُعد ادبی، هنری و زیباشناختی موضوع باشد - تحلیل جنبه‌های هنری و ارزش‌های زیبایی‌شناسانه'
        }
      ]
    }
  ],

  [Mode.REWRITE_TEXT]: [
    {
      id: 'rewrite_intensity',
      label: 'شدت بازنویسی',
      tags: [
        {
          id: 'intensity_light',
          label: 'ویرایش سبک و روان‌سازی',
          description: 'تغییرات جزئی',
          promptFragment: 'فقط ویرایش سبک انجام بده - اصلاح اشکالات نگارشی، روان‌تر کردن جملات، و حفظ ساختار کلی متن'
        },
        {
          id: 'intensity_complete',
          label: 'بازنویسی کامل با حفظ معنا',
          description: 'تغییر کامل ساختار',
          promptFragment: 'بازنویسی کامل انجام بده - ساختار جملات را تغییر بده، عبارات جدید استفاده کن، اما معنای دقیق متن را حفظ کن'
        },
        {
          id: 'intensity_summarize',
          label: 'خلاصه‌سازی ادبی',
          description: 'فشرده‌سازی',
          promptFragment: 'متن را خلاصه و فشرده کن - نکات اصلی را حفظ کن اما حجم را کاهش بده، با نثر ادبی و روان'
        },
        {
          id: 'intensity_expand',
          label: 'توسعه و بسط متن',
          description: 'افزودن جزئیات',
          promptFragment: 'متن را توسعه و بسط بده - جزئیات بیشتر اضافه کن، توضیحات کامل‌تری بده، و حجم متن را افزایش بده'
        }
      ]
    },
    {
      id: 'rewrite_style',
      label: 'سبک هدف',
      tags: [
        {
          id: 'style_news',
          label: 'مقاله‌نویسی خبری',
          description: 'سبک روزنامه‌ای',
          promptFragment: 'متن را به سبک مقاله‌نویسی خبری و روزنامه‌ای بازنویسی کن - واضح، مستقیم، بی‌طرفانه و اطلاع‌رسان'
        },
        {
          id: 'style_analytical',
          label: 'مقاله تحلیلی',
          description: 'سبک تحلیلی',
          promptFragment: 'متن را به سبک مقاله تحلیلی بازنویسی کن - با تحلیل عمیق، استدلال محکم و بررسی علل و معلول‌ها'
        },
        {
          id: 'style_literary',
          label: 'متن ادبی - نثری',
          description: 'سبک ادبی',
          promptFragment: 'متن را به نثر ادبی و هنری بازنویسی کن - با استعاره‌ها، تشبیهات، آرایه‌های ادبی و زبان شاعرانه'
        },
        {
          id: 'style_educational',
          label: 'متن آموزشی برای غیرمتخصص',
          description: 'سبک تدریسی',
          promptFragment: 'متن را به سبک آموزشی و تدریسی بازنویسی کن - ساده، گام‌به‌گام، با مثال‌های واضح و قابل فهم برای عموم'
        },
        {
          id: 'style_academic',
          label: 'سبک دانشگاهی - رسمی',
          description: 'سبک علمی',
          promptFragment: 'متن را به سبک دانشگاهی و علمی بازنویسی کن - رسمی، با واژگان تخصصی، ساختار استدلالی و لحن عینی'
        }
      ]
    },
    {
      id: 'rewrite_complexity',
      label: 'سطح پیچیدگی',
      tags: [
        {
          id: 'complexity_simple',
          label: 'زبان ساده برای عموم',
          description: 'سطح ابتدایی',
          promptFragment: 'زبان متن را بسیار ساده کن - برای عموم مردم قابل فهم، بدون واژگان دشوار و اصطلاحات تخصصی'
        },
        {
          id: 'complexity_moderate',
          label: 'زبان نسبتاً تخصصی',
          description: 'سطح متوسط',
          promptFragment: 'زبان متن در حد متوسط تا نسبتاً تخصصی باشد - برای افراد با سواد متوسط تا بالا'
        },
        {
          id: 'complexity_heavy',
          label: 'ادبی سنگین و کلاسیک',
          description: 'سطح پیشرفته',
          promptFragment: 'زبان متن ادبی سنگین، کلاسیک و با واژگان ادبی قدیمی و سنتی باشد - مناسب برای خوانندگان علاقه‌مند به نثر سنتی'
        },
        {
          id: 'complexity_modern',
          label: 'ادبی معاصر و روان',
          description: 'سطح مدرن',
          promptFragment: 'زبان متن ادبی معاصر و روان باشد - زیبا اما قابل فهم، با واژگان امروزی و ساختار مدرن'
        }
      ]
    },
    {
      id: 'rewrite_focus',
      label: 'تمرکز اصلاح',
      tags: [
        {
          id: 'focus_coherence',
          label: 'تمرکز بر انسجام منطقی',
          description: 'پیوستگی',
          promptFragment: 'تمرکز اصلی بر انسجام منطقی و پیوستگی ایده‌ها باشد - جریان فکری روان، ارتباط واضح بین جملات و بندها'
        },
        {
          id: 'focus_beauty',
          label: 'تمرکز بر زیبایی و استعاره‌ها',
          description: 'جنبه هنری',
          promptFragment: 'تمرکز اصلی بر زیبایی نثر، استعاره‌ها، تشبیهات و آرایه‌های ادبی باشد - متن را از نظر هنری غنی‌تر کن'
        },
        {
          id: 'focus_brevity',
          label: 'تمرکز بر کوتاه‌نویسی',
          description: 'اختصار',
          promptFragment: 'تمرکز اصلی بر کوتاه‌نویسی و اختصار باشد - کلمات اضافی حذف شوند، جملات مختصر و مفید باشند'
        },
        {
          id: 'focus_clarity',
          label: 'حذف ابهام و تکرار',
          description: 'وضوح',
          promptFragment: 'تمرکز اصلی بر حذف ابهام‌ها، تکرارهای غیرضروری و مبهم‌بودن‌ها باشد - همه چیز واضح و شفاف'
        }
      ]
    }
  ],

  [Mode.FIND_PROVERBS]: [
    {
      id: 'proverb_tone',
      label: 'لحن ضرب‌المثل',
      tags: [
        {
          id: 'tone_formal_proverb',
          label: 'رسمی و متین',
          description: 'ضرب‌المثل رسمی',
          promptFragment: 'ضرب‌المثل‌ها را رسمی، متین و با لحن جدی انتخاب کن - مناسب برای متون رسمی و نوشتار علمی'
        },
        {
          id: 'tone_colloquial',
          label: 'محاوره‌ای و خودمانی',
          description: 'ضرب‌المثل عامیانه',
          promptFragment: 'ضرب‌المثل‌های محاوره‌ای، خودمانی و نزدیک به گفتار روزمره انتخاب کن - مناسب برای متون صمیمی'
        },
        {
          id: 'tone_humorous',
          label: 'طنزآمیز',
          description: 'ضرب‌المثل شوخ‌طبعانه',
          promptFragment: 'ضرب‌المثل‌های طنزآمیز، شوخ‌طبعانه و با حال و هوای خنده‌دار انتخاب کن'
        },
        {
          id: 'tone_moral',
          label: 'پندآموز و اخلاقی',
          description: 'ضرب‌المثل تربیتی',
          promptFragment: 'ضرب‌المثل‌های پندآموز، اخلاقی و با بار تربیتی بالا انتخاب کن - مناسب برای آموزش اخلاق'
        },
        {
          id: 'tone_sarcastic',
          label: 'انتقادی / طعنه‌آلود',
          description: 'ضرب‌المثل طنزگونه',
          promptFragment: 'ضرب‌المثل‌های انتقادی، طعنه‌آمیز و با بار سیاسی یا اجتماعی انتخاب کن'
        }
      ]
    },
    {
      id: 'proverb_familiarity',
      label: 'میزان شناخت',
      tags: [
        {
          id: 'familiarity_common',
          label: 'بسیار رایج و آشنا',
          description: 'همه می‌شناسند',
          promptFragment: 'ضرب‌المثل‌ها را تا حد امکان رایج، مشهور و قابل فهم برای عموم انتخاب کن - ضرب‌المثل‌هایی که همه می‌شناسند'
        },
        {
          id: 'familiarity_moderate',
          label: 'نسبتاً کمتر شنیده‌شده',
          description: 'نیمه‌آشنا',
          promptFragment: 'ضرب‌المثل‌هایی انتخاب کن که نسبتاً کمتر شنیده‌شده باشند اما هنوز قابل فهم - ترکیبی از آشنا و تازه'
        },
        {
          id: 'familiarity_rare',
          label: 'ضرب‌المثل‌های کهن و ادبی',
          description: 'نایاب و کلاسیک',
          promptFragment: 'ضرب‌المثل‌های کهن، قدیمی و ادبی انتخاب کن - ضرب‌المثل‌هایی که در متون کلاسیک دیده می‌شوند'
        }
      ]
    },
    {
      id: 'proverb_usage',
      label: 'کاربرد در متن',
      tags: [
        {
          id: 'usage_opening',
          label: 'مناسب برای آغاز مقاله',
          description: 'شروع متن',
          promptFragment: 'ضرب‌المثل‌هایی انتخاب کن که برای افتتاح و آغاز مقاله مناسب باشند - زمینه‌ساز ورود به موضوع'
        },
        {
          id: 'usage_closing',
          label: 'مناسب برای جمع‌بندی',
          description: 'پایان متن',
          promptFragment: 'ضرب‌المثل‌هایی انتخاب کن که برای جمع‌بندی و نتیجه‌گیری پایان مقاله مناسب باشند'
        },
        {
          id: 'usage_subtitle',
          label: 'برای میان‌تیتر',
          description: 'عنوان بخش',
          promptFragment: 'ضرب‌المثل‌هایی انتخاب کن که به‌عنوان میان‌تیتر یا عنوان بخش‌های مقاله قابل استفاده باشند'
        },
        {
          id: 'usage_emphasis',
          label: 'برای تأکید احساسی وسط متن',
          description: 'تقویت نکته',
          promptFragment: 'ضرب‌المثل‌هایی انتخاب کن که برای تأکید احساسی و تقویت نکات کلیدی در میان متن مناسب باشند'
        }
      ]
    }
  ]
};

