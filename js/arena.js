/* Three.js hero: "Stage Light"
   Dust motes rising slowly through the tunnel light, a few bright bokeh
   sparks that twinkle, and a slow drift of larger out-of-focus discs.
   Additive, screen-blended over the walk-out photo. Mouse parallax.
   Pauses when off screen, disabled for reduced motion. */
import * as THREE from 'three';

const canvas = document.getElementById('arena');
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = window.matchMedia('(max-width: 767px)').matches;
if (canvas && !reduced && !small) init();

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 18);

  /* soft round sprite texture drawn on a canvas */
  function discTexture(inner, outer) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, `rgba(255,255,255,${inner})`);
    grd.addColorStop(0.35, `rgba(255,255,255,${inner * 0.6})`);
    grd.addColorStop(1, `rgba(255,255,255,${outer})`);
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  const softTex = discTexture(1, 0);

  /* ---------- layer builder ---------- */
  function layer(count, opts) {
    const pos = new Float32Array(count * 3), vel = new Float32Array(count), ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * opts.w;
      pos[i * 3 + 1] = (Math.random() - 0.5) * opts.h;
      pos[i * 3 + 2] = (Math.random() - 0.5) * opts.d;
      vel[i] = opts.speed * (0.5 + Math.random());
      ph[i] = Math.random() * Math.PI * 2;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ map: softTex, color: opts.color, size: opts.size, transparent: true, opacity: opts.opacity, depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true });
    const pts = new THREE.Points(geo, mat);
    scene.add(pts);
    return { pts, geo, pos, vel, ph, count, ...opts };
  }

  const dust = layer(900, { w: 60, h: 34, d: 30, speed: 0.35, size: 0.16, color: 0xEDFC0D, opacity: 0.55 });
  const motes = layer(160, { w: 50, h: 30, d: 20, speed: 0.18, size: 0.9, color: 0xEDFC0D, opacity: 0.16 });
  const sparks = layer(70, { w: 56, h: 30, d: 24, speed: 0.25, size: 0.45, color: 0xFFFFFF, opacity: 0.9 });
  const sparkBase = 0.9;

  /* ---------- interaction ---------- */
  const mouse = new THREE.Vector2(0, 0), target = new THREE.Vector2(0, 0);
  window.addEventListener('pointermove', (e) => {
    target.x = (e.clientX / window.innerWidth) * 2 - 1;
    target.y = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.02 }).observe(canvas);

  const clock = new THREE.Clock();
  let last = 0;

  function advance(L, dt, t, sway) {
    const half = L.h / 2;
    for (let i = 0; i < L.count; i++) {
      let y = L.pos[i * 3 + 1] + L.vel[i] * dt;
      if (y > half) y = -half;
      L.pos[i * 3 + 1] = y;
      L.pos[i * 3] += Math.sin(t * 0.6 + L.ph[i]) * sway * dt;
    }
    L.geo.attributes.position.needsUpdate = true;
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const dt = Math.min(0.05, t - last); last = t;
    mouse.lerp(target, 0.04);

    advance(dust, dt, t, 0.6);
    advance(motes, dt, t, 0.25);
    advance(sparks, dt, t, 0.4);

    /* twinkle */
    sparks.pts.material.opacity = sparkBase * (0.55 + 0.45 * Math.sin(t * 3.1));
    sparks.pts.material.size = 0.45 + 0.15 * Math.sin(t * 2.3);
    motes.pts.rotation.z = Math.sin(t * 0.05) * 0.05;

    camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.03;
    camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  frame();
}
