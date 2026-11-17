import { log, error as logError } from 'node:console';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { inspectRelease, verifyRelease } from './release.mjs';

// Run explicit assert scenarios directly, without relying on a nested process test harness.
const scenarios = [];
function test(name, run) { scenarios.push({ name, run }); }

async function fixture(context) {
  const directory = await mkdtemp(join(tmpdir(), 'flora-release-'));
  context.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'assets'));
  await writeFile(join(directory, 'index.html'), '<meta name="flora-data-mode" content="mock"><div id="root"></div><script type="module" src="/assets/index-test.js"></script>');
  await writeFile(join(directory, 'assets/index-test.js'), 'export const sample = true;');
  return directory;
}
test('writes and verifies a deterministic mock manifest, then rejects changed assets', async (context) => {
  const directory = await fixture(context); const manifest = await inspectRelease(directory);
  assert.equal(manifest.liveIntegrations, false); assert.equal(manifest.files.length, 2);
  await writeFile(join(directory, 'release-manifest.json'), JSON.stringify(manifest));
  assert.deepEqual(await verifyRelease(directory), manifest);
  assert.deepEqual(await inspectRelease(directory), manifest);
  await writeFile(join(directory, 'assets/index-test.js'), 'changed');
  await assert.rejects(verifyRelease(directory), /integrity mismatch/);
  await writeFile(join(directory, 'assets/index-test.js'), 'export const sample = true;');
  assert.deepEqual(await verifyRelease(directory), manifest);
});
test('rejects sensitive/unsupported files and source maps', async (context) => {
  const directory = await fixture(context);
  for (const name of ['.env', 'debug.map', 'credentials.json']) {
    await writeFile(join(directory, name), 'fictional sentinel'); await assert.rejects(inspectRelease(directory)); await rm(join(directory, name));
  }
});
test('rejects symlinked assets and a symlinked manifest', async (context) => {
  const directory = await fixture(context);
  for (const name of ['assets/link.js', 'release-manifest.json']) {
    await symlink(join(directory, 'assets/index-test.js'), join(directory, name));
    await assert.rejects(inspectRelease(directory), /symlinks/); await rm(join(directory, name));
  }
});
test('rejects missing/local-external asset references and absent mock markers', async (context) => {
  const directory = await fixture(context); const entry = join(directory, 'index.html'); const original = await readFile(entry, 'utf8');
  for (const replacement of [original.replace('index-test.js', 'missing.js'), original.replace('/assets/index-test.js', 'https://example.invalid/app.js'), original.replace('content="mock"', 'content="live"')]) {
    await writeFile(entry, replacement); await assert.rejects(inspectRelease(directory));
  }
});
test('rejects extra metadata and missing manifests during verification', async (context) => {
  const directory = await fixture(context); await assert.rejects(verifyRelease(directory));
  const value = await inspectRelease(directory); await writeFile(join(directory, 'release-manifest.json'), JSON.stringify({ ...value, liveIntegrations: true }));
  await assert.rejects(verifyRelease(directory), /integrity mismatch/);
});

test('rejects an entry with only CSS references and no executable application', async (context) => {
  const directory = await fixture(context);
  await writeFile(join(directory, 'assets/index-test.css'), 'body { color: black; }');
  await writeFile(join(directory, 'index.html'), '<meta name="flora-data-mode" content="mock"><div id="root"></div><link rel="stylesheet" href="/assets/index-test.css">');
  await assert.rejects(inspectRelease(directory), /bootstrap/);
});
test('rejects an entry without the application mount point', async (context) => {
  const directory = await fixture(context); const entry = join(directory, 'index.html');
  await writeFile(entry, (await readFile(entry, 'utf8')).replace('<div id="root"></div>', ''));
  await assert.rejects(inspectRelease(directory), /bootstrap/);
});
test('rejects classic or non-JavaScript bootstrap entries', async (context) => {
  const directory = await fixture(context); const entry = join(directory, 'index.html'); const original = await readFile(entry, 'utf8');
  await writeFile(join(directory, 'assets/index-test.css'), 'body { color: black; }');
  for (const replacement of [original.replace('type="module"', ''), original.replace('index-test.js', 'index-test.css')]) {
    await writeFile(entry, replacement); await assert.rejects(inspectRelease(directory), /bootstrap/);
  }
});
test('accepts a recovery link but rejects malformed or tampered manifest contents', async (context) => {
  const directory = await fixture(context); const entry = join(directory, 'index.html');
  await writeFile(entry, (await readFile(entry, 'utf8')).replace('<div id="root"></div>', '<div id="root"><a href="/">Try again</a></div>'));
  const manifest = await inspectRelease(directory); await writeFile(join(directory, 'release-manifest.json'), JSON.stringify(manifest));
  await verifyRelease(directory);
  for (const contents of ['{', JSON.stringify({ ...manifest, files: [] })]) {
    await writeFile(join(directory, 'release-manifest.json'), contents); await assert.rejects(verifyRelease(directory));
  }
});

const failures = [];
for (const scenario of scenarios) {
  const cleanup = [];
  try {
    await scenario.run({ after: (callback) => cleanup.push(callback) });
    log(`PASS: ${scenario.name}`);
  } catch (error) {
    failures.push(error); logError(`FAIL: ${scenario.name}`);
  } finally {
    for (const callback of cleanup) await callback();
  }
}
if (failures.length) throw new AggregateError(failures, `${failures.length} release scenarios failed.`);
log(`${scenarios.length} release scenarios passed.`);
