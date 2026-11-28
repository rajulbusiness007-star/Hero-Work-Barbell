import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, type Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensures image assets in public/images/ (materialized from lossless base64
 * manifests in src/assets/images-data/) are written before Vite transforms
 * HTML/CSS, served in Vite dev mode, and copied into dist/images/ on build.
 */
function syncAndServeImageAssets(): Plugin {
  const publicImagesDir = path.resolve(__dirname, 'public/images');
  const b64Dir = path.resolve(__dirname, 'src/assets/images-data');
  const mimeByExt: Record<string, string> = {
    '.avif': 'image/avif',
    '.webp': 'image/webp',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
  };

  function collectManifestGroups(): Map<string, string[]> {
    const groups = new Map<string, string[]>();
    if (!fs.existsSync(b64Dir)) return groups;
    for (const entry of fs.readdirSync(b64Dir)) {
      const partMatch = entry.match(/^(.+)\.b64(?:\.(p\d+))?$/);
      if (!partMatch) continue;
      const outName = partMatch[1];
      const list = groups.get(outName) || [];
      list.push(entry);
      groups.set(outName, list);
    }
    for (const [outName, entries] of groups.entries()) {
      entries.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      groups.set(outName, entries);
    }
    return groups;
  }

  function decodeB64Image(filename: string): Buffer | null {
    const groups = collectManifestGroups();
    const entries = groups.get(filename);
    if (!entries || entries.length === 0) return null;
    const raw = entries
      .map((entry) => fs.readFileSync(path.join(b64Dir, entry), 'utf8').replace(/\s+/g, ''))
      .join('');
    return Buffer.from(raw, 'base64');
  }

  function materializeFromManifests(): void {
    const groups = collectManifestGroups();
    if (groups.size === 0) return;
    fs.mkdirSync(publicImagesDir, { recursive: true });
    for (const outName of groups.keys()) {
      const outPath = path.join(publicImagesDir, outName);
      const buf = decodeB64Image(outName);
      if (buf && (!fs.existsSync(outPath) || !fs.readFileSync(outPath).equals(buf))) {
        fs.writeFileSync(outPath, buf);
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
      server.middlewares.use('/images', (req, res, next) => {
        const cleanUrl = (req.url || '').split('?')[0].replace(/^\/+/, '');
        if (!cleanUrl || cleanUrl.includes('..')) {
          return next();
        }
        const ext = path.extname(cleanUrl).toLowerCase();
        const contentType = mimeByExt[ext] || 'application/octet-stream';
        const diskPath = path.join(publicImagesDir, cleanUrl);
        if (fs.existsSync(diskPath) && fs.statSync(diskPath).isFile()) {
          res.setHeader('Content-Type', contentType);
          fs.createReadStream(diskPath).pipe(res);
          return;
        }
        const buf = decodeB64Image(cleanUrl);
        if (buf) {
          res.setHeader('Content-Type', contentType);
          res.end(buf);
          return;
        }
        next();
      });
    },
    closeBundle(error?: Error): void {
      if (error) return;
      const distDir = path.resolve(__dirname, 'dist');
      const distImagesDir = path.resolve(distDir, 'images');
      if (!fs.existsSync(distDir)) return;
      fs.mkdirSync(distImagesDir, { recursive: true });

      if (fs.existsSync(publicImagesDir)) {
        for (const entry of fs.readdirSync(publicImagesDir)) {
          const srcFile = path.join(publicImagesDir, entry);
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
