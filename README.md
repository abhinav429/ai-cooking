# AI Kitchen

Full-stack portfolio project: an AI-assisted cooking app. Scan pantry photos, get recipe ideas, save favorites, and browse by cuisine or category.

## Stack

- **Frontend:** Next.js, React, Tailwind CSS, Clerk (auth), Arcjet (rate limits)
- **Backend:** Strapi 5 (headless CMS), PostgreSQL
- **AI / media:** OpenAI-compatible API (e.g. AICredits) for Gemini-class models, Unsplash for images

## Run locally

1. **Backend:** `cd backend && npm install && npm run develop` — API at `http://localhost:1337`
2. **Frontend:** `cd frontend && npm install && npm run dev` — app at `http://localhost:3000` (or the port Next prints)

Copy environment variables from each app’s `.env.example` where present, and configure `.env` with your own keys (database, Clerk, Strapi secrets, AI keys, etc.).

## Assets / branding

- Favicon and header/footer use `frontend/public/logo-mark.svg` (simple SVG mark — replace with your own logo if you like).
- Older PNGs (`logo.png`, `orange-logo.png`, `pasta-dish.png`) are leftover placeholder art; the landing hero still points at `pasta-dish.png` — drop in your own file and update `app/page.js` if you want it fully custom.

## License

Private portfolio use; adjust as needed for your deployment.
