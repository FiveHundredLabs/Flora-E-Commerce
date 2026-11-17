import { createHash } from 'node:crypto';
import { lstat, readdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { argv } from 'node:process';

const manifestName = 'release-manifest.json';
export async function inspectRelease(directory) {
  const root = await lstat(directory);
  if (!root.isDirectory() || root.isSymbolicLink()) throw new Error('Preview artifact root must be a regular directory.');
  const files = [];
  async function walk(relative = '') {
    for (const name of (await readdir(join(directory, relative))).sort()) {
      const path = relative ? `${relative}/${name}` : name;
      const entry = await lstat(join(directory, path));
      if (name.startsWith('.') || entry.isSymbolicLink()) throw new Error('Hidden files and symlinks are forbidden in preview artifacts.');
      if (path === manifestName && entry.isFile()) continue;
      if (entry.isDirectory()) { await walk(path); continue; }
      if (!entry.isFile() || !/^(index\.html|assets\/[\w-]+\.(?:js|css|svg|png|webp|jpg|ico|woff2))$/.test(path)) throw new Error('Unexpected file in preview artifact.');
      const contents = await readFile(join(directory, path));
      files.push({ path, bytes: contents.byteLength, sha256: createHash('sha256').update(contents).digest('hex') });
    }
  }
  await walk();
  const entry = files.find((file) => file.path === 'index.html');
  if (!entry) throw new Error('Preview entry HTML is missing.');
  const html = await readFile(join(directory, 'index.html'), 'utf8');
  if (!/<meta name="flora-data-mode" content="mock"\s*\/?\s*>/.test(html)) throw new Error('Preview mock-mode marker is missing.');
  // Inspect the known Vite entry structure, not arbitrary navigational anchor links.
  const attribute = (tag, name) => new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, 'i').exec(tag)?.[2];
  const tags = [...html.replace(/<!--[\s\S]*?-->/g, '').matchAll(/<([a-z][\w:-]*)\b[^>]*>/gi)];
  const mount = tags.some(([tag, name]) => name?.toLowerCase() === 'div' && attribute(tag, 'id') === 'root');
  const module = tags.some(([tag, name]) => name?.toLowerCase() === 'script' && attribute(tag, 'type') === 'module' && /^\/assets\/[\w-]+\.js$/.test(attribute(tag, 'src') ?? ''));
  if (!mount || !module) throw new Error('Preview application bootstrap is missing or invalid.');
  const references = tags.flatMap(([tag, name]) => {
    const reference = name?.toLowerCase() === 'script' ? attribute(tag, 'src') : name?.toLowerCase() === 'link' ? attribute(tag, 'href') : undefined;
    return reference === undefined ? [] : [reference];
  });
  if (!references.length || references.some((path) => !path?.startsWith('/assets/') || !files.some((file) => `/${file.path}` === path))) throw new Error('Preview entry references an external or missing asset.');
  return { schemaVersion: 1, dataMode: 'mock', liveIntegrations: false, files: files.sort((a, b) => a.path.localeCompare(b.path)) };
}
export async function verifyRelease(directory) {
  const actual = await inspectRelease(directory);
  const recorded = JSON.parse(await readFile(join(directory, manifestName), 'utf8'));
  if (JSON.stringify(recorded) !== JSON.stringify(actual)) throw new Error('Preview artifact integrity mismatch. Rebuild or restore the complete prior artifact.');
  return actual;
}
if (argv[1] && resolve(argv[1]) === fileURLToPath(import.meta.url)) {
  const directory = fileURLToPath(new URL('../dist/', import.meta.url));
  if (argv[2] === '--write') await writeFile(join(directory, manifestName), `${JSON.stringify(await inspectRelease(directory), null, 2)}\n`);
  else await verifyRelease(directory);
}
