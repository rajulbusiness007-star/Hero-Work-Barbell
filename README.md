# Hero-Work-Barbell

Website for **Ironwork Barbell** — a 24/7 powerlifting, conditioning, and contrast-recovery gym in Austin, TX.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set `GEMINI_API_KEY` (and optional `VITE_GOOGLE_MAPS_API_KEY`) in `.env.local`
3. Start the dev server:
   `npm run dev`
4. Open `http://localhost:3000`

## Deploy on Vercel

1. Ensure image assets in `src/assets/images/` are present in the repository.
2. Import the repository into Vercel (`vercel.json` runs `npm install`, builds Vite to `dist`, and routes `/api/*` to `api/index.ts`).
3. Add `GEMINI_API_KEY` (and optional `VITE_GOOGLE_MAPS_API_KEY`) under **Project Settings → Environment Variables**.
