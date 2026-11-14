// Copies the few three.js files the Extras (bust, intro, screen wall) use from node_modules
// into public/vendor/three, so the site serves them itself. Runs before dev and build.
import { cpSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

const files = [
  'build/three.module.js',
  'examples/jsm/loaders/GLTFLoader.js',
  'examples/jsm/utils/BufferGeometryUtils.js',
  'examples/jsm/environments/RoomEnvironment.js',
  'examples/jsm/libs/meshopt_decoder.module.js',
];
for (const f of files) {
  const to = join('public/vendor/three', f);
  mkdirSync(dirname(to), { recursive: true });
  cpSync(join('node_modules/three', f), to);
}
console.log(`vendor-three: copied ${files.length} files`);
