# Propel MVP (Next.js + Tailwind)

This is a deploy-ready MVP for **Propel** — a hybrid nonprofit + direct-giving platform for student debt relief.

## Local Setup

```bash
# 1) Install deps
npm install

# 2) Start dev server
npm run dev
# App will be on http://localhost:3000
```

## Deploy to Vercel (shareable link)

**Option A — GitHub Flow (recommended):**
1. Create a new GitHub repo and push this folder.
2. Go to https://vercel.com/import (or the Vercel dashboard) → **New Project** → **Import from GitHub**.
3. Select the repo and deploy with defaults (Next.js detected automatically).
4. You’ll get a `https://your-project.vercel.app` link to share.

**Option B — Vercel CLI:**
```bash
npm i -g vercel
vercel
# Follow prompts; first deploy gives you a preview URL; run `vercel --prod` for a production URL.
```

No env vars are required. Payments are simulated in the demo UI.

## Notes
- Built with **Next.js App Router** and **TailwindCSS**.
- All data is **mocked** locally for a safe investor demo.
- “Tax-deductible (Foundation)” and “Direct to Student” are selectable in the donation modal.
