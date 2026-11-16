import { lstatSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Plugin } from 'vite';
import { previewHeaders } from './preview';

/** Keep reserved build assets out of the document-route SPA fallback. Local preview only. */
export function previewAssets(): Plugin {
  return { name: 'flora-preview-assets', configurePreviewServer(server) {
    const directory = resolve(server.config.root, server.config.build.outDir);
    server.middlewares.use((request, response, next) => {
      let path: string;
      try { path = decodeURIComponent((request.url ?? '/').split('?')[0] ?? '/'); } catch { return next(); }
      if (!path.startsWith('/assets/')) return next();
      try {
        if (/^\/assets\/[\w-]+\.(?:js|css|svg|png|webp|jpg|ico|woff2)$/.test(path)
          && lstatSync(join(directory, path.slice(1))).isFile()) return next();
      } catch { /* Missing assets get a real 404 below, not the application document. */ }
      response.statusCode = 404;
      for (const [name, value] of Object.entries(previewHeaders)) response.setHeader(name, value);
      response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      response.end(request.method === 'HEAD' ? undefined : 'Asset not found.');
    });
  } };
}
