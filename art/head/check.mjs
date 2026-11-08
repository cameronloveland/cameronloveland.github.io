// Checks a head GLB against the hero contract and the web budget in the spec
// (docs/superpowers/specs/2026-11-08-cyborg-head-bust-design.md). It reads only the
// GLB's JSON chunk, so it needs no decoder for meshopt-compressed buffers.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const MAX_BYTES = 3 * 1024 * 1024;
export const MAX_TRIANGLES = 40000;
export const JOINTS = ['Bust', 'Head'];
export const HEAD_CHILDREN = ['EyeHuman', 'EyeRed', 'Glasses'];

function readJson(buf) {
  if (buf.length < 20 || buf.toString('ascii', 0, 4) !== 'glTF') throw new Error('not a GLB (bad magic)');
  if (buf.readUInt32LE(4) !== 2) throw new Error('not a GLB version 2');
  const length = buf.readUInt32LE(12);
  if (buf.toString('ascii', 16, 20) !== 'JSON') throw new Error('not a GLB (first chunk is not JSON)');
  return JSON.parse(buf.toString('utf8', 20, 20 + length));
}

function meshTriangles(json, mesh) {
  let tris = 0;
  for (const p of mesh.primitives ?? []) {
    const mode = p.mode ?? 4;
    if (mode < 4) continue; // points and lines carry no triangles
    const index = p.indices ?? p.attributes.POSITION;
    const acc = json.accessors?.[index];
    if (!acc) throw new Error(`a primitive points at missing accessor ${index}`);
    tris += mode === 4 ? Math.floor(acc.count / 3) : Math.max(0, acc.count - 2); // 5 strip, 6 fan
  }
  return tris;
}

export function checkGlb(buf) {
  const errors = [];
  const stats = { bytes: buf.length, triangles: 0, nodes: [] };
  try {
    inspect(readJson(buf), errors, stats);
  } catch (e) {
    errors.push(e.message);
  }
  if (stats.triangles > MAX_TRIANGLES) errors.push(`${stats.triangles} triangles is over the ${MAX_TRIANGLES} budget`);
  if (stats.bytes >= MAX_BYTES) errors.push(`${(stats.bytes / 1048576).toFixed(2)} MB is over the 3 MB budget`);
  return { ok: errors.length === 0, errors, stats };
}

function inspect(json, errors, stats) {
  const nodes = json.nodes ?? [];
  stats.nodes = nodes.map((n) => n.name).filter(Boolean); // quantization can add unnamed mesh nodes
  const parent = new Map();
  nodes.forEach((n, i) => (n.children ?? []).forEach((c) => parent.set(c, i)));
  const byName = new Map(nodes.map((n, i) => [n.name, i]));

  for (const n of nodes) if (n.mesh !== undefined) stats.triangles += meshTriangles(json, json.meshes[n.mesh]);

  for (const name of [...JOINTS, ...HEAD_CHILDREN]) {
    if (!byName.has(name)) errors.push(`missing node ${name}`);
  }
  const sceneRoots = new Set(json.scenes?.[json.scene ?? 0]?.nodes ?? []);
  const isRoot = (i) => !parent.has(i) && sceneRoots.has(i);
  const bust = byName.get('Bust');
  const head = byName.get('Head');
  if (bust !== undefined && !isRoot(bust)) errors.push('Bust must be a root node of the scene');
  if (head !== undefined && !(isRoot(head) || parent.get(head) === bust)) errors.push('Head must be a scene root or a child of Bust');

  // The hero turns Head by bending a skinned neck, so a skin must be driven by Head and Bust.
  const skins = json.skins ?? [];
  if (!skins.length) errors.push('no skin; the neck must be skinned to Head and Bust');
  else if (!skins.some((s) => s.joints?.includes(head) && s.joints?.includes(bust))) errors.push('no skin is driven by both Head and Bust');

  if (head !== undefined) {
    const t = nodes[head].translation;
    if (t && t.some((v) => Math.abs(v) > 1e-6)) errors.push(`Head has a translation ${JSON.stringify(t)}; the JS owns head.position`);
    const r = nodes[head].rotation;
    if (r && (Math.abs(r[0]) > 1e-6 || Math.abs(r[1]) > 1e-6 || Math.abs(r[2]) > 1e-6)) errors.push(`Head has a rest rotation ${JSON.stringify(r)}; the JS overwrites head.rotation`);
    if (nodes[head].matrix) errors.push('Head uses a matrix; it must use TRS with no translation');
    for (const name of HEAD_CHILDREN) {
      const i = byName.get(name);
      if (i !== undefined && parent.get(i) !== head) errors.push(`${name} is not a child of Head`);
    }
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const file = process.argv[2];
  if (!file) {
    console.error('usage: node art/head/check.mjs <file.glb>');
    process.exit(2);
  }
  const r = checkGlb(readFileSync(file));
  console.log(`${file}: ${(r.stats.bytes / 1024).toFixed(0)} KB, ${r.stats.triangles} triangles, nodes ${r.stats.nodes.join(', ')}`);
  for (const e of r.errors) console.error(`  fail: ${e}`);
  process.exit(r.ok ? 0 : 1);
}
