/* MRB hero — real-time 3D mixed-reality headset: fly-in, drag to spin, exploded view on scroll */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

const host = document.querySelector("[data-hero3d]");
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

if (host) { try { init(); } catch (e) { console.warn("MRB 3D disabled:", e); document.documentElement.classList.add("no-webgl"); } }

function glowTexture() {
  const c = document.createElement("canvas"); c.width = c.height = 128;
  const g = c.getContext("2d"), gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  gr.addColorStop(0, "rgba(160,240,255,1)"); gr.addColorStop(0.25, "rgba(61,139,255,.55)"); gr.addColorStop(1, "rgba(42,91,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function init() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
  if (!renderer.getContext()) throw new Error("no gl");
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.3, 12);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  scene.add(new THREE.AmbientLight(0x6080ff, 0.25));
  const key = new THREE.DirectionalLight(0xffffff, 1.4); key.position.set(4, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0x3d8bff, 5); rim.position.set(-6, 2, -5); scene.add(rim);
  const rim2 = new THREE.DirectionalLight(0x7fe8ff, 3); rim2.position.set(6, -2, -4); scene.add(rim2);
  const under = new THREE.PointLight(0x2a5bff, 30, 12); under.position.set(0, -3, 2); scene.add(under);

  /* ---------- headset parts (each part = group with base pos + explode vector) ---------- */
  const rig = new THREE.Group(); scene.add(rig);
  const hs = new THREE.Group(); rig.add(hs); hs.rotation.order = "YXZ";
  const parts = [];
  const part = (ex, ey, ez, spin = 0) => { const g = new THREE.Group(); g.userData = { ex: new THREE.Vector3(ex, ey, ez), spin }; hs.add(g); parts.push(g); return g; };

  const shell = new THREE.MeshPhysicalMaterial({ color: 0xeef3fb, roughness: 0.28, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.12, sheen: 0.4, sheenColor: new THREE.Color(0x9fd8ff) });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x03060e, roughness: 0.04, metalness: 0.6, clearcoat: 1, clearcoatRoughness: 0.02, iridescence: 0.9, iridescenceIOR: 1.6, iridescenceThicknessRange: [180, 600], envMapIntensity: 1.6 });
  const fabric = new THREE.MeshStandardMaterial({ color: 0x1a1f2b, roughness: 0.95 });
  const strapM = new THREE.MeshPhysicalMaterial({ color: 0x2a3142, roughness: 0.55, clearcoat: 0.3 });
  const glow = new THREE.MeshBasicMaterial({ color: 0x9ff0ff });
  const wire = new THREE.MeshBasicMaterial({ color: 0x7fe8ff, wireframe: true, transparent: true, opacity: 0 });

  // front visor (glass + light bar + eyes + sensors)
  const pFront = part(0, 0.1, 1.7, 0.3);
  const front = new THREE.Mesh(new RoundedBoxGeometry(3.06, 1.38, 0.3, 8, 0.14), glass); front.position.z = 0.56; pFront.add(front);
  const bar = new THREE.Mesh(new RoundedBoxGeometry(2.1, 0.06, 0.04, 2, 0.02), glow); bar.position.set(0, -0.42, 0.73); pFront.add(bar);
  const eyeM = new THREE.MeshBasicMaterial({ color: 0x3d8bff, transparent: true, opacity: 0.55 });
  [-0.68, 0.68].forEach((x) => { const e = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.25, 48), eyeM); e.position.set(x, 0.08, 0.72); pFront.add(e); });
  const sens = new THREE.MeshPhysicalMaterial({ color: 0x0b0f18, roughness: 0.1, metalness: 0.9 });
  [[-1.25, 0.45], [1.25, 0.45], [-1.25, -0.45], [1.25, -0.45]].forEach(([x, y]) => { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.04, 24), sens); s.rotation.x = Math.PI / 2; s.position.set(x, y, 0.72); pFront.add(s); });
  const gTex = glowTexture();
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9 }));
  sprite.scale.set(3.4, 0.9, 1); sprite.position.set(0, -0.42, 0.8); pFront.add(sprite);

  // lenses (only visible exploded)
  const pLens = part(0, 0.05, 0.9, -0.4);
  const lensM = new THREE.MeshPhysicalMaterial({ color: 0x9fd8ff, transmission: 0.9, thickness: 0.4, roughness: 0.05, metalness: 0, ior: 1.5, transparent: true, opacity: 0.85 });
  [-0.68, 0.68].forEach((x) => { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 48), lensM); l.rotation.x = Math.PI / 2; l.position.set(x, 0.05, 0.25); pLens.add(l); const r = new THREE.Mesh(new THREE.TorusGeometry(0.44, 0.03, 12, 60), glow); r.position.set(x, 0.05, 0.25); pLens.add(r); });

  // core body + wireframe ghost
  const pBody = part(0, 0, 0);
  const body = new THREE.Mesh(new RoundedBoxGeometry(3.3, 1.6, 1.25, 8, 0.5), shell); pBody.add(body);
  const ghost = new THREE.Mesh(new RoundedBoxGeometry(3.32, 1.62, 1.27, 4, 0.5), wire); pBody.add(ghost);
  const chip = new THREE.Mesh(new RoundedBoxGeometry(1.1, 0.5, 0.08, 2, 0.04), new THREE.MeshPhysicalMaterial({ color: 0x0b1530, metalness: 0.8, roughness: 0.3, emissive: 0x1a3cff, emissiveIntensity: 0.6 }));
  const pChip = part(0, 1.5, 0.2, 0.5); chip.position.set(0, 0.2, 0); pChip.add(chip);

  // face cushion
  const pCush = part(0, -0.1, -1.1, 0.2);
  const cushion = new THREE.Mesh(new RoundedBoxGeometry(2.95, 1.35, 0.5, 6, 0.22), fabric); cushion.position.z = -0.72; pCush.add(cushion);

  // arms
  [-1, 1].forEach((sd) => {
    const pa = part(sd * 1.1, 0, -0.3, 0);
    const arm = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.55, 1.5, 4, 0.1), shell); arm.position.set(sd * 1.62, 0, -1.05); pa.add(arm);
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 16), glow); led.position.set(sd * 1.66, 0.42, 0.1); pa.add(led);
  });
  // straps + battery dial
  const pStrap = part(0, -0.2, -1.5, 0);
  const strap = new THREE.Mesh(new THREE.TorusGeometry(1.62, 0.13, 20, 120), strapM); strap.rotation.x = Math.PI / 2; strap.scale.set(1, 1.25, 1.6); strap.position.z = -2.05; pStrap.add(strap);
  const pTop = part(0, 1.1, -0.9, 0);
  const top = new THREE.Mesh(new THREE.TorusGeometry(1.7, 0.1, 16, 80, Math.PI), strapM); top.rotation.y = Math.PI / 2; top.position.set(0, 0.25, -2.0); top.scale.set(1, 0.85, 1); pTop.add(top);
  const pBatt = part(0, 0, -2.6, 0.6);
  const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 48), shell); dial.rotation.x = Math.PI / 2; dial.position.set(0, 0, -4.05); pBatt.add(dial);
  const battLed = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.02, 8, 40), glow); battLed.position.set(0, 0, -4.17); pBatt.add(battLed);

  parts.forEach((p) => (p.userData.base = p.position.clone()));
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: gTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35 }));
  halo.scale.set(11, 11, 1); halo.position.set(0, 0, -3); rig.add(halo);
  hs.scale.setScalar(0.92);

  // label anchors (local to parts)
  const anchors = [[pFront, new THREE.Vector3(-0.68, 0.08, 0.72)], [pLens, new THREE.Vector3(0.68, 0.05, 0.3)], [pBatt, new THREE.Vector3(0, 0, -4.17)], [pChip, new THREE.Vector3(0, 0.2, 0)]];
  const labels = [...document.querySelectorAll("[data-hlab]")];
  const hero = document.querySelector("[data-hero]");
  const content = document.querySelector("[data-hero-content]");
  const tag = document.querySelector("[data-hero-tag]");
  const exploded = document.querySelector("[data-exploded]");
  const hud = document.querySelector(".hero__hud");
  const rings3 = document.querySelector(".hero__rings");
  const pinEl = document.querySelector(".hero__pin"), lsvg = document.querySelector("[data-hlines]");
  const lines = lsvg ? [...lsvg.querySelectorAll("line")] : null, circles = lsvg ? [...lsvg.querySelectorAll("circle")] : [];

  /* ---------- orbit rings ---------- */
  const rings = new THREE.Group(); rig.add(rings);
  const ringMat = (o) => new THREE.MeshBasicMaterial({ color: 0x7fe8ff, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false });
  [[3.4, 0.012, 0.65, 1.2], [3.9, 0.008, 0.35, -0.9], [4.6, 0.006, 0.22, 0.6]].forEach(([r, t, o, tilt], i) => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 8, 220), ringMat(o)); m.rotation.x = Math.PI / 2 + tilt * 0.35; m.rotation.y = tilt * 0.3; m.userData.s = 0.1 + i * 0.05; rings.add(m);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 12), glow); dot.position.x = r; m.add(dot);
  });

  /* ---------- particles ---------- */
  const N = innerWidth < 700 ? 900 : 2200, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const r = 4 + Math.random() * 10, a = Math.random() * Math.PI * 2, y = (Math.random() - 0.5) * 9; pos[i * 3] = Math.cos(a) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(a) * r - 4; }
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pts = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.035, color: 0x9fd8ff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false }));
  scene.add(pts);

  /* ---------- layout ---------- */
  let wide = true, W = 1, H = 1, baseX = 0, baseY = 0, baseS = 1;
  function resize() {
    W = host.clientWidth; H = host.clientHeight;
    renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix();
    wide = W / H > 1.05;
    baseX = wide ? 3.25 : 0; baseY = wide ? 1.55 : 2.25;
    baseS = wide ? Math.min(0.8, W / 2000 + 0.1) : Math.min(0.62, W / 760);
  }
  resize(); addEventListener("resize", resize);

  /* ---------- interaction: mouse, drag-to-spin ---------- */
  let mx = 0, my = 0, tx = 0, ty = 0, introStart = null, prog = 0, visible = true;
  let dragYaw = 0, dragVel = 0, dragging = false, lastX = 0;
  addEventListener("pointermove", (e) => { mx = (e.clientX / innerWidth) * 2 - 1; my = (e.clientY / innerHeight) * 2 - 1; if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; dragVel = dx * 0.012; dragYaw += dragVel; } });
  hero.addEventListener("pointerdown", (e) => { if (e.target.closest("a,button")) return; dragging = true; lastX = e.clientX; });
  addEventListener("pointerup", () => (dragging = false));
  const startIntro = () => { if (introStart == null) introStart = performance.now(); };
  document.addEventListener("mrb:loaded", startIntro);
  setTimeout(startIntro, 7000);
  new IntersectionObserver((e) => (visible = e[0].isIntersecting)).observe(hero);
  const readScroll = () => { const r = hero.getBoundingClientRect(); prog = clamp(-r.top / (r.height - innerHeight), 0, 1); };

  const clock = new THREE.Clock(), v3 = new THREE.Vector3();
  const easeOut = (t) => 1 - Math.pow(1 - t, 4);
  let introE = 0;
  function frame() {
    requestAnimationFrame(frame);
    if (!visible) return;
    const t = clock.getElapsedTime();
    readScroll();
    if (introStart != null) introE = Math.min(1, (performance.now() - introStart) / 2200);
    const ei = reduced ? 1 : easeOut(introE);
    tx += (mx - tx) * 0.05; ty += (my - ty) * 0.05;
    if (!dragging) { dragVel *= 0.95; dragYaw += dragVel; }

    // scroll phases
    const toCenter = smooth(0.02, 0.28, prog);
    const ex = smooth(0.24, 0.5, prog) * (1 - smooth(0.82, 0.98, prog));
    const lab = smooth(0.42, 0.52, prog) * (1 - smooth(0.74, 0.82, prog));
    const out = smooth(0.9, 1, prog);

    rig.position.set(lerp(baseX, wide ? 1.05 : 0, toCenter), lerp(baseY, wide ? 0 : 0.6, toCenter) + out * 2.5, 0);
    rig.scale.setScalar(baseS * lerp(1, wide ? 1.15 : 1.1, toCenter) * (1 - ex * 0.22));

    hs.rotation.y = (1 - ei) * -2.6 + tx * 0.5 * (1 - toCenter * 0.6) - 0.62 + toCenter * 1.25 + smooth(0.3, 0.95, prog) * 1.1 + dragYaw + (reduced ? 0 : Math.sin(t * 0.5) * 0.06);
    hs.rotation.x = ty * 0.3 + 0.16 + ex * 0.32;
    hs.rotation.z = (1 - ei) * 0.4 + Math.sin(t * 0.7) * 0.03;
    hs.position.y = (reduced ? 0 : Math.sin(t * 1.1) * 0.12) - (1 - ei) * 1.2;
    hs.position.z = (1 - ei) * -6;

    parts.forEach((p) => { p.position.copy(p.userData.base).addScaledVector(p.userData.ex, ex); p.rotation.z = p.userData.spin * ex * Math.sin(t * 0.6 + p.userData.spin * 3) * 0.3; });
    wire.opacity = ex * 0.35;
    rings.children.forEach((r, i) => { r.rotation.z = t * r.userData.s * (i % 2 ? -1 : 1) * (1 + ex * 3); r.material.opacity = (0.65 - i * 0.18) * ei * (1 - out); });
    pts.rotation.y = t * 0.03 + tx * 0.1 + prog * 1.5; pts.position.y = prog * 1.2;
    sprite.material.opacity = 0.7 + Math.sin(t * 3) * 0.2;
    bar.material.color.setHSL(0.53 + Math.sin(t * 0.8) * 0.03, 1, 0.75);
    halo.material.opacity = 0.3 * ei * (1 + ex);
    renderer.render(scene, camera);

    // DOM sync
    if (content) { content.style.opacity = 1 - smooth(0.04, 0.22, prog); content.style.transform = `translate3d(0,${-prog * 260}px,0)`; content.style.filter = `blur(${smooth(0.04, 0.22, prog) * 10}px)`; }
    if (tag) { tag.style.opacity = 1 - smooth(0.03, 0.15, prog); tag.style.pointerEvents = prog > 0.1 ? "none" : ""; }
    if (hud) hud.style.opacity = 1 - smooth(0.05, 0.2, prog);
    if (exploded) { const o = smooth(0.3, 0.42, prog) * (1 - smooth(0.8, 0.9, prog)); exploded.style.opacity = o; exploded.style.transform = `translateY(${(1 - o) * 30}px)`; }
    if (rings3) rings3.style.transform = `translateY(-55%) scale(${1 + ex * 0.35}) rotate(${prog * 90}deg)`;
    if (lines) labels.forEach((el, i) => {
      const [p, local] = anchors[i];
      v3.copy(local); p.localToWorld(v3); v3.project(camera);
      const x = (v3.x * 0.5 + 0.5) * W, y = (-v3.y * 0.5 + 0.5) * H;
      const lr = el.getBoundingClientRect(), pr = pinEl.getBoundingClientRect();
      const lx = el.classList.contains("hlab--r") ? lr.left - pr.left : lr.right - pr.left, ly = lr.top - pr.top + lr.height / 2;
      const ln = lines[i], c = circles[i];
      ln.setAttribute("x1", lx); ln.setAttribute("y1", ly); ln.setAttribute("x2", x); ln.setAttribute("y2", y);
      c.setAttribute("cx", x); c.setAttribute("cy", y);
      el.style.opacity = lab; ln.style.opacity = lab * 0.9; c.style.opacity = lab;
    });
  }
  frame();
}
