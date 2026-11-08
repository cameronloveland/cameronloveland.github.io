import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkGlb, MAX_BYTES } from './check.mjs';

// Packs a minimal GLB: 12-byte header, a JSON chunk, and an optional BIN chunk of zeros.
function makeGlb(json, binLength = 0) {
  let text = JSON.stringify(json);
  while (text.length % 4) text += ' ';
  const jsonBytes = Buffer.from(text, 'utf8');
  const binBytes = Buffer.alloc(binLength + ((4 - (binLength % 4)) % 4));
  const total = 12 + 8 + jsonBytes.length + (binLength ? 8 + binBytes.length : 0);
  const out = Buffer.alloc(total);
  out.write('glTF', 0, 'ascii');
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(total, 8);
  out.writeUInt32LE(jsonBytes.length, 12);
  out.write('JSON', 16, 'ascii');
  jsonBytes.copy(out, 20);
  if (binLength) {
    const at = 20 + jsonBytes.length;
    out.writeUInt32LE(binBytes.length, at);
    out.write('BIN\0', at + 4, 'ascii');
  }
  return out;
}

// A scene that meets the contract: Bust and Head at the root, the eyes and glasses under Head.
function contract({ indexCount = 300, headTranslation, eyeRedUnderHead = true, names } = {}) {
  const n = names ?? ['Bust', 'Head', 'EyeHuman', 'EyeRed', 'Glasses'];
  const head = { name: n[1], mesh: 0, children: eyeRedUnderHead ? [2, 3, 4] : [2, 4] };
  if (headTranslation) head.translation = headTranslation;
  const nodes = [
    { name: n[0], mesh: 0 },
    head,
    { name: n[2], mesh: 0, translation: [-0.3, 0.14, 0.8] },
    { name: n[3], mesh: 0, translation: [0.3, 0.14, 0.8] },
    { name: n[4] },
  ];
  return {
    asset: { version: '2.0' },
    scene: 0,
    scenes: [{ nodes: eyeRedUnderHead ? [0, 1] : [0, 1, 3] }],
    nodes,
    meshes: [{ primitives: [{ attributes: { POSITION: 0 }, indices: 1, mode: 4 }] }],
    accessors: [
      { count: 100, type: 'VEC3', componentType: 5126 },
      { count: indexCount, type: 'SCALAR', componentType: 5125 },
    ],
  };
}

test('a GLB that meets the contract passes', () => {
  const r = checkGlb(makeGlb(contract()));
  assert.deepEqual(r.errors, []);
  assert.equal(r.ok, true);
  assert.equal(r.stats.triangles, 400); // four mesh nodes share one 100-triangle mesh; Glasses is empty
  assert.deepEqual(r.stats.nodes, ['Bust', 'Head', 'EyeHuman', 'EyeRed', 'Glasses']);
});

test('a missing contract node fails and names it', () => {
  const r = checkGlb(makeGlb(contract({ names: ['Bust', 'Head', 'EyeHuman', 'EyeRed', 'Specs'] })));
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('Glasses')), r.errors.join('\n'));
});

test('EyeRed outside Head fails', () => {
  const r = checkGlb(makeGlb(contract({ eyeRedUnderHead: false })));
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('EyeRed') && e.includes('Head')), r.errors.join('\n'));
});

test('a Head with its own translation fails', () => {
  const r = checkGlb(makeGlb(contract({ headTranslation: [0, 0.5, 0] })));
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('translation')), r.errors.join('\n'));
});

test('a zero Head translation is allowed', () => {
  const r = checkGlb(makeGlb(contract({ headTranslation: [0, 0, 0] })));
  assert.equal(r.ok, true, r.errors.join('\n'));
});

test('over 40,000 triangles fails', () => {
  const r = checkGlb(makeGlb(contract({ indexCount: 30003 }))); // 10001 x 4 mesh nodes = 40004
  assert.equal(r.stats.triangles, 40004);
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('triangles')), r.errors.join('\n'));
});

test('a file over 3 MB fails', () => {
  const r = checkGlb(makeGlb(contract(), MAX_BYTES));
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('MB')), r.errors.join('\n'));
});

test('a buffer that is not a GLB fails', () => {
  const r = checkGlb(Buffer.from('not a model at all'));
  assert.equal(r.ok, false);
  assert.ok(r.errors.some((e) => e.includes('not a GLB')), r.errors.join('\n'));
});
