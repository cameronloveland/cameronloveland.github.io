// The hero's extras: the cyborg bust, the intro and the head that looks around the screen wall.
// Loaded on demand by billboard-hero.html; the default hero never fetches this file.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const hero = document.querySelector('.hero');
const canvas = document.getElementById('head');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
camera.position.set(0, 0, 9);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.25));
const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(-4, 3, 6); scene.add(key);
const rim = new THREE.DirectionalLight(0x6f00ff, 5); rim.position.set(5, 2, -4); scene.add(rim);
const rim2 = new THREE.DirectionalLight(0x6f00ff, 3); rim2.position.set(-5, -1, -3); scene.add(rim2);

// Placeholder head: left half human, right half android
const rig = new THREE.Group();     // moves for the scroll peek
const head = new THREE.Group();    // turns toward the mouse
rig.add(head); scene.add(rig);
const skull = new THREE.Group(); skull.scale.set(0.82, 1.08, 0.95); head.add(skull);

const skin = new THREE.MeshStandardMaterial({ color: 0xc8957c, roughness: 0.55, metalness: 0.0 });
const metal = new THREE.MeshStandardMaterial({ color: 0x1a1a22, roughness: 0.28, metalness: 0.95 });
const humanHalf = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 56, -Math.PI / 2, Math.PI), skin);
const droidHalf = new THREE.Mesh(new THREE.SphereGeometry(1, 72, 56, Math.PI / 2, Math.PI), metal);
skull.add(humanHalf, droidHalf);
const wire = new THREE.Mesh(new THREE.SphereGeometry(1.006, 18, 14, Math.PI / 2, Math.PI),
  new THREE.MeshBasicMaterial({ color: 0x8a3dff, wireframe: true, transparent: true, opacity: 0.55 }));
skull.add(wire);
const seam = new THREE.Mesh(new THREE.TorusGeometry(1.0, 0.018, 12, 120), new THREE.MeshBasicMaterial({ color: 0x3ef0b4 }));
seam.rotation.y = Math.PI / 2; skull.add(seam);

// Eyes (in head space, sitting on the scaled skull)
function eye(x, droid) {
  const g = new THREE.Group();
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 24),
    droid ? new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.2, metalness: 0.8 })
          : new THREE.MeshStandardMaterial({ color: 0xf2efe9, roughness: 0.3 }));
  const iris = new THREE.Mesh(new THREE.SphereGeometry(0.058, 24, 16),
    droid ? new THREE.MeshBasicMaterial({ color: 0x3ef0b4 })
          : new THREE.MeshStandardMaterial({ color: 0x2a2018, roughness: 0.4 }));
  iris.position.z = 0.085; g.add(ball, iris);
  g.position.set(x, 0.14, 0.83);
  head.add(g);
  if (droid) { const l = new THREE.PointLight(0x3ef0b4, 1.4, 1.6); l.position.set(0, 0, 0.25); g.add(l); }
  return g;
}
const eyes = [eye(-0.27, false), eye(0.27, true)];

// Brow, nose, mouth hints
const nose = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.26, 16), skin);
nose.position.set(0, -0.05, 0.98); nose.rotation.x = -0.35; head.add(nose);
const mouthH = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.05), new THREE.MeshStandardMaterial({ color: 0x7a3f37 }));
mouthH.position.set(-0.1, -0.42, 0.87); head.add(mouthH);
const mouthD = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.025, 0.05), new THREE.MeshBasicMaterial({ color: 0x3ef0b4 }));
mouthD.position.set(0.1, -0.42, 0.87); head.add(mouthD);

// Neck
const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.44, 1.2, 40), new THREE.MeshStandardMaterial({ color: 0x131318, roughness: 0.4, metalness: 0.7 }));
neck.position.y = -1.45; rig.add(neck);

// Hands that grip the hero's bottom edge as it closes (visual only)
const mintMat = new THREE.MeshBasicMaterial({ color: 0x3ef0b4 });
function makeHand(droid) {
  const g = new THREE.Group();
  const mat = droid ? metal : skin;
  const fingerGeo = new THREE.CapsuleGeometry(0.06, 0.3, 6, 14);
  const tipGeo = new THREE.CapsuleGeometry(0.055, 0.12, 6, 14);
  const xs = [-0.2, -0.067, 0.067, 0.2];
  const hs = [-0.03, 0.03, 0.02, -0.05];
  xs.forEach((x, i) => {
    const f = new THREE.Mesh(fingerGeo, mat);
    f.position.set(x, hs[i], 0); f.rotation.x = 0.35; g.add(f);
    const tip = new THREE.Mesh(tipGeo, mat);
    tip.position.set(x, hs[i] + 0.2, 0.12); tip.rotation.x = 1.25; g.add(tip);
    if (droid) {
      const j = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 8), mintMat);
      j.position.set(x, hs[i] + 0.17, 0.09); g.add(j);
    }
  });
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.46, 0.17), mat);
  palm.position.set(0, -0.32, -0.06); g.add(palm);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 4.2, 28), droid ? metal : skin);
  arm.position.set(0, -0.32 - 0.2 - 2.1, -0.08); g.add(arm);
  if (droid) {
    for (let k = 0; k < 6; k++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.235, 0.012, 8, 40), new THREE.MeshBasicMaterial({ color: k === 0 ? 0x3ef0b4 : 0x8a3dff }));
      ring.rotation.x = Math.PI / 2; ring.position.set(0, -0.75 - k * 0.55, -0.08); g.add(ring);
    }
  }
  if (droid) {
    const w = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.48, 0.18), new THREE.MeshBasicMaterial({ color: 0x8a3dff, wireframe: true, transparent: true, opacity: 0.5 }));
    w.position.copy(palm.position); g.add(w);
  }
  g.scale.setScalar(1.15);
  scene.add(g);
  return g;
}
const hands = [
  { g: makeHand(false), side: -1 },  // human hand on the human side
  { g: makeHand(true), side: 1 }     // android hand on the android side
];
let grip = 0;

// The Blender bust (art/head/head.glb, node contract in the head spec). The placeholder
// stays until it loads, and for good if it fails. The code below keeps driving the
// placeholder `head` group; each frame copies its pose onto the bust's Head joint.
let headJoint = null;
let eyeGlow = null;  // the red dot's halo and light, set once the bust loads
new GLTFLoader().setMeshoptDecoder(MeshoptDecoder).load('/models/head.glb', gltf => {
  const bust = gltf.scene;
  const joint = bust.getObjectByName('Head');
  // Skin with several materials (skin, hair, beard, metal) loads as a Group of SkinnedMeshes.
  const skin = bust.getObjectByName('Skin');
  const skinned = skin && (skin.isSkinnedMesh || skin.children.some(c => c.isSkinnedMesh));
  if (!joint?.isBone || !bust.getObjectByName('Bust')?.isBone || !skinned) {
    console.warn('Head GLB does not match the contract (Bust and Head bones, a Skin mesh); keeping the placeholder');
    return;
  }
  bust.traverse(o => { if (o.isSkinnedMesh) o.frustumCulled = false; }); // skinned bounds are computed once
  // Chrome needs something to mirror: a room environment on the metal and lens only, so
  // the skin and cloth keep the hero's own lighting.
  const env = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
  bust.traverse(o => {
    for (const m of [].concat(o.material || [])) {
      if (/^(Metal|MetalDark|EyeLens|Glasses)/.test(m.name)) { m.envMap = env; m.envMapIntensity = 1.2; m.needsUpdate = true; }
    }
  });
  joint.rotation.copy(head.rotation); joint.position.y = head.position.y;
  rig.add(bust);
  // The red dot glows: brighter emission, an additive halo sprite and a small red light
  // at the dot, all children of the Head joint so they turn with the head; they pulse.
  bust.updateMatrixWorld(true);
  let dotMesh = null;
  bust.getObjectByName('EyeRed')?.traverse(o => { if (o.isMesh && [].concat(o.material).some(m => m.name === 'EyeRed')) dotMesh = o; });
  if (dotMesh) {
    for (const m of [].concat(dotMesh.material)) if (m.name === 'EyeRed') { m.emissiveIntensity = 4; m.toneMapped = false; }
    dotMesh.geometry.computeBoundingBox();
    const dot = dotMesh.localToWorld(dotMesh.geometry.boundingBox.getCenter(new THREE.Vector3()));
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g2 = c.getContext('2d'), grad = g2.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,235,220,1)'); grad.addColorStop(0.12, 'rgba(255,70,40,0.95)');
    grad.addColorStop(0.4, 'rgba(255,30,10,0.35)'); grad.addColorStop(1, 'rgba(255,0,0,0)');
    g2.fillStyle = grad; g2.fillRect(0, 0, 128, 128);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), color: 0xffffff,
      blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, toneMapped: false }));
    const eyeLight = new THREE.PointLight(0xff2a1a, 1.2, 0.9, 2);
    const local = joint.worldToLocal(dot.clone());
    const forward = new THREE.Vector3(0, 0, 0.05);  // the Head joint's rest pose faces +Z
    halo.position.copy(local).add(forward); eyeLight.position.copy(local).addScaledVector(forward, 3);
    joint.add(halo, eyeLight);
    eyeGlow = { halo, light: eyeLight, size: 0.42 };
  }
  head.visible = false; neck.visible = false;
  headJoint = joint;
}, undefined, err => console.warn('Head GLB failed to load; keeping the placeholder', err));

const HEAD_SCALE = 1.15;
rig.scale.setScalar(HEAD_SCALE);
const EYE_LOCAL_Y = 0.14 * HEAD_SCALE;

let W = 1, H = 1, pxToWorld = 1, worldH = 1;
function resize() {
  W = hero.clientWidth; H = hero.clientHeight;
  renderer.setSize(W, H, false);
  camera.aspect = W / H; camera.updateProjectionMatrix();
  worldH = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
  pxToWorld = worldH / H;
}
window.addEventListener('resize', resize); resize();

const mouse = { x: window.innerWidth / 2, y: window.innerHeight * 0.4 };
let lastMove = -1e9;
window.addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; lastMove = performance.now(); });

const look = { x: 0, y: 0 };

// Intro timeline (ms from start)
const introEl = document.getElementById('intro');
const introInner = document.getElementById('intro-inner');
const IT = { s1: 150, s2: 2000, handsUp: 3700, pull: 4400, pullEnd: 5100, head: 4800, headEnd: 5850, ready: 5500, end: 6150 };
// No intro by default: the page opens on the arrival alone (the head rises, the words and
// slides come in). Watch intro plays the full sequence.
const ARRIVE = 4700;
let introT0 = performance.now() - ARRIVE, introDone = false, quick = true;
const clamp01 = v => Math.min(1, Math.max(0, v));
const easeOut = v => 1 - Math.pow(1 - v, 3);
const easeIn = v => v * v * v;
const easeOutBack = v => { const c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(v - 1, 3) + c1 * Math.pow(v - 1, 2); };
const hc = { x: 0, y: 0, s: 1, hide: (window.__heroCfg || {}).hide ? 1 : 0 }; // start parked when loaded into the slideshow
const introEndCbs = [];
export function onIntroEnd(cb) { introEndCbs.push(cb); }
function finishIntro() { introEndCbs.splice(0).forEach(cb => cb()); introDone = true; if ((window.__heroCfg || {}).hide) hc.hide = 1; hero.classList.remove('intro-on'); hero.classList.add('ready', 'lit'); introEl.classList.add('gone'); introInner.style.transform = ''; }
export function startIntro() {
  if (!introDone && !quick) return; // one intro at a time
  window.scrollTo(0, 0);
  introEl.className = 'intro'; introInner.style.transform = '';
  hero.classList.remove('ready', 'lit');
  introT0 = performance.now(); introDone = false; quick = false; hero.classList.add('intro-on');
}
document.getElementById('skip').addEventListener('click', finishIntro);
if (matchMedia('(prefers-reduced-motion: reduce)').matches) finishIntro();
let peekY = 0, tilt = 0;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

function frame(t) {
  requestAnimationFrame(frame);
  const s = window.scrollY;
  if (s > H) return; // hero gone, stop drawing

  // Scroll peek: keep the eyes inside the visible strip of the hero, sliding down
  // toward its bottom edge as the strip shrinks.
  const HEAD_LIFT = H * 0.13; // head sits a little high so the reel overlaps the neck
  const defaultEyePx = H * 0.5 - HEAD_LIFT - EYE_LOCAL_Y / pxToWorld; // eye height in hero px with the head centred
  const navH = 72;                        // the fixed nav covers the top of the strip
  const top = s + navH;
  const visible = Math.max(0, H - top);
  // Eyes stay at least ~140px below the nav; once the strip is thinner than that,
  // they sit in its middle, then rest just above the ledge.
  let eyePx = Math.max(defaultEyePx, top + Math.min(140, visible * 0.5));
  eyePx = Math.min(eyePx, H - 34);         // eyes just above the ledge
  if (reduce) eyePx = defaultEyePx;
  const targetY = -(eyePx - defaultEyePx) * pxToWorld + HEAD_LIFT * pxToWorld;
  peekY += (targetY - peekY) * 0.18;
  rig.position.y = peekY;

  // The page can move, scale or park the head through window.__heroCfg (see applyHero).
  // The offsets ease in on a mode switch and let go as the page scrolls into the peek.
  const cfg = window.__heroCfg || {};
  const rest = 1 - clamp01(s / (H * 0.4));
  hc.x += ((cfg.x || 0) - hc.x) * 0.08;
  hc.y += ((cfg.y || 0) - hc.y) * 0.08;
  hc.s += ((cfg.s || 1) - hc.s) * 0.08;
  const settled = introDone || quick;
  const bustOff = hero.classList.contains('nobust') && settled;
  hc.hide += ((bustOff ? 1 : (cfg.hide && settled) ? 1 - clamp01(s / (H * 0.28)) : 0) - hc.hide) * 0.07;
  rig.position.x = hc.x * W * pxToWorld;
  rig.position.y += hc.y * rest * H * pxToWorld - hc.hide * 6.5;
  rig.scale.setScalar(HEAD_SCALE * hc.s);

  // Intro: the head starts below frame and pulls itself up after the text is gone
  let introHands = null, introStare = 0;
  if (!introDone) {
    const e = (window.__freeze != null) ? window.__freeze : performance.now() - introT0;
    if (!quick && e > IT.s1) introEl.classList.add('s1');
    if (!quick && e > IT.s2) introEl.classList.add('s2');
    if (!quick && e > IT.pull - 150) { introEl.classList.add('pulling'); hero.classList.add('lit'); }
    const pull = easeIn(clamp01((e - IT.pull) / (IT.pullEnd - IT.pull)));
    const pullPx = pull * H * 0.8;
    introInner.style.transform = 'translateY(' + pullPx + 'px)';
    const up = easeOut(clamp01((e - IT.handsUp) / 650));
    const textBottomPx = introInner.offsetTop + introInner.offsetHeight * 0.9;
    const gripY = (H / 2 - textBottomPx) * pxToWorld;
    const halfW = Math.min(1.7, (introInner.offsetWidth * 0.32) * pxToWorld);
    if (!quick) introHands = { y: (-worldH / 2 - 1.0) + (gripY - (-worldH / 2 - 1.0)) * up - pullPx * pxToWorld, x: halfW, on: e > IT.handsUp, tug: pull };
    const rise = easeOutBack(clamp01((e - IT.head) / (IT.headEnd - IT.head)));
    rig.position.y += (1 - rise) * -5.6;
    introStare = quick ? 0 : 1;
    if (e > IT.ready) hero.classList.add('ready');
    if (e > IT.end) finishIntro();
  }
  const peekAmt = Math.min(1, Math.max(0, (eyePx - defaultEyePx) / (H * 0.3)));
  tilt += ((peekAmt * 0.16) - tilt) * 0.08;

  // Look at the mouse, measured from where the head is on screen right now
  const headScreenX = W / 2 + hc.x * W;
  const headScreenY = (eyePx - s) - hc.y * rest * H;
  // Idle for 2.5s: glance at the project the reel is showing
  let lx = mouse.x, ly = mouse.y;
  const active = hero.classList.contains('show') ? (cfg.glance ? document.querySelector(cfg.glance) : null)
    : document.querySelector('.hero.tvmode .tv.on') || document.querySelector('.hero:not(.tvmode) .rc.on');
  if (active && performance.now() - lastMove > 2500) {
    const r = active.getBoundingClientRect();
    lx = r.left + r.width / 2; ly = r.top + r.height / 2;
  }
  const dx = (lx - headScreenX) / (W / 2);
  const dy = (ly - headScreenY) / (window.innerHeight / 2);
  const tx = THREE.MathUtils.clamp(dx, -1.2, 1.2) * 0.62;
  const ty = THREE.MathUtils.clamp(dy, -1.2, 1.2) * 0.42;
  // grip is last frame's value; blend from mouse-tracking to eye contact as the hands come up
  const stare = Math.max(introStare, Math.min(1, grip * 1.6));
  const fx = tx * (1 - stare), fy = ty * (1 - stare) + (-0.1) * stare;
  look.x += (fx - look.x) * 0.09;
  look.y += (fy - look.y) * 0.09;
  head.rotation.set(look.y, look.x, tilt);
  if (!reduce) head.position.y = Math.sin(t / 1400) * 0.03;
  if (headJoint) { headJoint.rotation.copy(head.rotation); headJoint.position.y = head.position.y; }

  // Grip: hands start rising while the hero words fade (they are gone at a ~300px
  // strip), so the fingertips crest the ledge as the words leave; strain grows as it closes.
  const gripTarget = reduce ? 0 : Math.min(1, Math.max(0, (430 - visible) / 130));
  grip += (gripTarget - grip) * 0.15;
  const strain = Math.min(1, Math.max(0, (190 - visible) / 170));
  const ledgeY = -worldH / 2;
  hands.forEach((h, i) => {
    const shakeX = Math.sin(t / 38 + i * 2.1) * 0.014 * strain;
    const shakeY = Math.sin(t / 31 + i * 1.3) * 0.02 * strain;
    if (introHands && introHands.on) {
      const tugShake = Math.sin(t / 30 + i * 1.7) * 0.02 * introHands.tug;
      h.g.position.set(h.side * introHands.x + tugShake, introHands.y, 0.6);
      h.g.rotation.set(0, -h.side * 0.12, -h.side * 0.1);
      h.g.visible = true;
      return;
    }
    h.g.position.set(rig.position.x + h.side * (1.42 - strain * 0.06) + shakeX, ledgeY - 0.75 + grip * 0.74 + shakeY, 0.6);
    h.g.rotation.set(0, -h.side * 0.12, -h.side * (0.16 + strain * 0.05));
    h.g.visible = grip > 0.01;
  });

  if (eyeGlow) {  // a slow, uneven pulse, like a powered sensor
    const p = 0.85 + 0.15 * Math.sin(t * 0.004) + 0.05 * Math.sin(t * 0.0137);
    eyeGlow.halo.scale.setScalar(eyeGlow.size * p);
    eyeGlow.halo.material.opacity = 0.75 + 0.25 * p;
    eyeGlow.light.intensity = 1.2 * p;
  }
  if (bustOff && hc.hide > 0.995) return; // nothing to draw while the bust is off
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);
