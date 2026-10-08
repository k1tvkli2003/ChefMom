# ChefMom

AI-powered Farsi cooking assistant ("for Mom"): quick recipe ideas from
what is already at home, weekly family meal plans, full step-by-step
recipes with exact quantities, leftover reinvention, healthier twists,
party menus, and warm kitchen tips in a casual tone.

## What's inside

Same proven skeleton as its sibling Farsi-Content-Pro: `App.tsx`,
`components/` (Header, ModeSelector, InputPanel, OutputPanel, Chatbot,
icons), `services/geminiService.ts` as the single model boundary,
`constants.ts`, `types.ts`, Tailwind + Vite + TS scaffolding, `.env.example`.

## Tech stack

React 19, Vite 6, TypeScript, Tailwind 3, `@google/genai`. Needs a Gemini
API key at runtime.

## Getting started

```bash
npm install
npm run dev
```

Install, set the key, run. `npm run build` for production.

## Status

Working single-purpose app (TypeScript). Set a Gemini API key and run.
