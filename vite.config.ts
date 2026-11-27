import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensures image assets in src/assets/images/ (and lossless base64 manifests in
 * src/assets/images-data/) are materialized before Vite transforms HTML/CSS,
 * served in Vite dev mode, and copied into dist/src/assets/images/ on build.
 */
function syncAndServeImageAssets(): Plugin {
  const srcImagesDir = path.resolve(__dirname, 'src/assets/images');
  const b64Dir = path.resolve(__dirname, 'src/assets/images-data');

  function decodeB64Image(filename: string): Buffer | null {
    const b64Path = path.join(b64Dir, `${filename}.b64`);
    if (!fs.existsSync(b64Path)) return null;
    const raw = fs.readFileSync(b64Path, 'utf8').trim();
    return Buffer.from(raw, 'base64');
  }

  function materializeFromManifests(): void {
    if (!fs.existsSync(b64Dir)) return;
    fs.mkdirSync(srcImagesDir, { recursive: true });
    for (const entry of fs.readdirSync(b64Dir)) {
      if (!entry.endsWith('.b64')) continue;
      const outName = entry.slice(0, -4);
      const outPath = path.join(srcImagesDir, outName);
      if (!fs.existsSync(outPath)) {
        const buf = decodeB64Image(outName);
        if (buf) {
          fs.writeFileSync(outPath, buf);
        }
      }
    }
  }

  return {
    name: 'sync-and-serve-image-assets',
    configResolved(): void {
      materializeFromManifests();
    },
    configureServer(server) {
      materializeFromManifests();
      server.middlewares.use('/src/assets/images', (req, res, next) => {
        const cleanUrl = (req.url || '').split('?')[0].replace(/^\/+/, '');
        if (!cleanUrl || cleanUrl.includes('..')) {
          return next();
        }
        const diskPath = path.join(srcImagesDir, cleanUrl);
        if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
          res.setHeader('Content-Type', 'image/jpeg');
          fs.createReadStream(diskPath).pipe(res);
          return;
        }
        const buf = decodeB64Image(cleanUrl);
        if (buf) {
          res.setHeader('Content-Type', 'image/jpeg');
          res.end(buf);
          return;
        }
        next();
      });
    },
    closeBundle(error?: Error): void {
      if (error) return;
      const distDir = path.resolve(__dirname, 'dist');
      const distImagesDir = path.resolve(distDir, 'src/assets/images');
      if (!fs.existsSync(distDir)) return;
      fs.mkdirSync(distImagesDir, { recursive: true });

      if (fs.existsSync(srcImagesDir)) {
        for (const entry of fs.readdirSync(srcImagesDir)) {
          const srcFile = path.join(srcImagesDir, entry);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, path.join(distImagesDir, entry));
          }
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      syncAndServeImageAssets(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
