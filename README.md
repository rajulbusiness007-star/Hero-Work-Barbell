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

1. Image assets in `src/assets/images/` (and lossless `.b64` manifests in `src/assets/images-data/`) are automatically materialized into `dist/src/assets/images/` during `npm run build` (`vite.config.ts`).
2. Import the repository into Vercel (`vercel.json` runs `npm install`, builds Vite to `dist`, and routes `/api/*` to `api/index.ts`).
3. Add `GEMINI_API_KEY` (and optional `VITE_GOOGLE_MAPS_API_KEY`) under **Project Settings → Environment Variables**.
