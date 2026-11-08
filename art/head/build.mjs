// Rebuilds the head from nothing: runs every steps/NN_*.py in headless Blender in
// filename order, compresses the raw export with gltf-transform (meshopt), checks the
// result against the hero contract and budget, and only then replaces art/head/head.glb.
// Usage: npm run head   (set BLENDER to the Blender executable if it is not found)
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkGlb } from './check.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const build = join(here, 'build');
const renders = join(here, 'renders');
const raw = join(build, 'raw.glb');
const packed = join(build, 'head.glb');
const shipped = join(here, 'head.glb');

function die(message) {
  console.error(`head build: ${message}`);
  process.exit(1);
}

function findBlender() {
  if (process.env.BLENDER) {
    if (existsSync(process.env.BLENDER)) return process.env.BLENDER;
    die(`BLENDER is set to ${process.env.BLENDER}, which does not exist.`);
  }
  const candidates = [
    process.platform === 'win32' ? 'C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe' : null,
    process.platform === 'darwin' ? '/Applications/Blender.app/Contents/MacOS/Blender' : null,
  ].filter(Boolean);
  for (const c of candidates) if (existsSync(c)) return c;
  const probe = spawnSync('blender', ['--version'], { encoding: 'utf8' });
  if (probe.status === 0) return 'blender';
  die('Blender 5.2 not found. Set BLENDER to the path of the Blender executable.');
}

function run(cmd, args, label) {
  const t = Date.now();
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const ok = r.status === 0 && !r.error;
  const notes = (r.stdout ?? '').split(/\r?\n/).filter((l) => l.startsWith('head build:'));
  for (const n of notes) console.log(`  ${n.slice('head build: '.length)}`);
  if (!ok) {
    console.error((r.stdout ?? '').split(/\r?\n/).slice(-40).join('\n'));
    console.error(r.stderr ?? '');
    die(`${label} failed (exit ${r.status ?? r.error?.message})`);
  }
  console.log(`${label} done in ${((Date.now() - t) / 1000).toFixed(1)}s`);
}

const blender = findBlender();
const steps = readdirSync(join(here, 'steps')).filter((f) => /^\d+_.+\.py$/.test(f)).sort();
if (!steps.length || !steps.at(-1).startsWith('90_export')) die('steps/ must end with 90_export.py');

// Clear both so nothing left over from an earlier run is mistaken for this one.
rmSync(build, { recursive: true, force: true });
rmSync(renders, { recursive: true, force: true });
mkdirSync(build, { recursive: true });

let previous = null;
for (const step of steps) {
  const out = join(build, step.replace(/\.py$/, '.blend'));
  const args = ['-b', ...(previous ? [previous] : []), '--python-exit-code', '1', '--python', join(here, 'steps', step), '--', '--out', out];
  if (step.startsWith('90_export')) args.push('--glb', raw, '--renders', renders);
  run(blender, args, step);
  previous = out;
}

const cliDir = join(here, '..', '..', 'node_modules', '@gltf-transform', 'cli');
if (!existsSync(join(cliDir, 'package.json'))) die('@gltf-transform/cli is missing; run npm install');
const cli = join(cliDir, JSON.parse(readFileSync(join(cliDir, 'package.json'), 'utf8')).bin['gltf-transform']);
run(process.execPath, [cli, 'meshopt', raw, packed], 'gltf-transform meshopt');

const result = checkGlb(readFileSync(packed));
const kb = (result.stats.bytes / 1024).toFixed(0);
console.log(`check: ${kb} KB, ${result.stats.triangles} triangles, nodes ${result.stats.nodes.join(', ')}`);
if (!result.ok) {
  for (const e of result.errors) console.error(`  fail: ${e}`);
  die(`check failed; ${relative(process.cwd(), shipped)} was left unchanged`);
}
copyFileSync(packed, shipped);
console.log(`wrote ${relative(process.cwd(), shipped)}; renders in ${relative(process.cwd(), renders)}`);
