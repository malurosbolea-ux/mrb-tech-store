/* MRB home — scroll scenes */
(function () {
  "use strict";
  const d = document, M = window.MRB; if (!M) return;
  const { $, $$ } = M;
  const hasGS = !!(window.gsap && window.ScrollTrigger) && !M.reduced;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- Drop rail products ---------- */
  function renderDrop() {
    const t = $("[data-drop-track]"); if (!t) return;
    t.innerHTML = M.products.map(M.cardHTML).join("") +
      `<div class="drop__end"><p class="t-nano" style="color:var(--cyan)">${M.T("Can't decide?", "¿No te decides?")}</p><p class="f-display t-h3">${M.T("Try them all in our Madrid lab.", "Pruébalos todos en nuestro lab de Madrid.")}</p>${M.btn("btn--primary", "vr-demo.html#book", M.T("Book a demo", "Reservar demo"))}</div>`;
    M.tilt(t);
  }

  /* ---------- Mini calendar teaser ---------- */
  function miniCal() {
    const c = $("[data-mini-cal]"); if (!c) return;
    const dows = M.lang === "es" ? ["L", "M", "X", "J", "V", "S", "D"] : ["M", "T", "W", "T", "F", "S", "S"];
    const now = new Date(); let html = dows.map((x) => `<span class="faint">${x}</span>`).join("");
    const start = new Date(now); start.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    for (let i = 0; i < 14; i++) { const dd = new Date(start); dd.setDate(start.getDate() + i); const past = dd < new Date(now.toDateString()); const sun = dd.getDay() === 0; html += `<span class="${past || sun ? "x" : ""} ${i === ((now.getDay() + 6) % 7) + 2 ? "on" : ""}">${dd.getDate()}</span>`; }
    c.innerHTML = html;
  }

  /* ---------- Statement scrub ---------- */
  function wrapScrub() {
    $$("[data-scrub]").forEach((p) => {
      const nodes = Array.from(p.childNodes);
      nodes.forEach((n) => {
        if (n.nodeType !== 3) return;
        const frag = d.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((tok) => {
          if (!tok) return;
          if (/^\s+$/.test(tok)) frag.appendChild(d.createTextNode(" "));
          else { const s = d.createElement("span"); s.className = "sw"; s.textContent = tok; frag.appendChild(s); }
        });
        p.replaceChild(frag, n);
      });
      
    });
  }
  let scrubST;
  function scrubScene() {
    const p = $("[data-scrub]"); if (!p) return;
    const words = $$(".sw, .rot", p);
    if (!hasGS) { words.forEach((w) => (w.style.opacity = 1)); return; }
    if (scrubST) scrubST.kill();
    scrubST = ScrollTrigger.create({
      trigger: p, start: "top 82%", end: "bottom 45%", scrub: true,
      onUpdate: (s) => { const n = words.length; words.forEach((w, i) => { w.style.opacity = clamp((s.progress * (n + 3) - i), 0.14, 1); }); }
    });
    $$(".floater").forEach((f) => gsap.to(f, { y: +f.dataset.speed, ease: "none", scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: true } }));
  }

  /* ---------- Worlds list ---------- */
  function worlds() {
    const rows = $$("[data-srow]"), imgs = $$(".fv__show img"), num = $("[data-fv-n]");
    const set = (i) => { rows.forEach((r, k) => r.classList.toggle("is-on", k === i)); imgs.forEach((im, k) => im.classList.toggle("is-on", k === i)); if (num) num.textContent = String(i + 1).padStart(2, "0"); };
    rows.forEach((r, i) => { r.addEventListener("mouseenter", () => set(i)); r.addEventListener("focus", () => set(i)); });
    if (hasGS) rows.forEach((r, i) => ScrollTrigger.create({ trigger: r, start: "top 55%", end: "bottom 55%", onToggle: (s) => s.isActive && set(i) }));
  }

  /* ---------- Marquee ---------- */
  function marquee() {
    const mq = $("[data-marquee]"); if (!mq) return;
    const tr = $(".mq__track", mq);
    const orig = tr.innerHTML; tr.innerHTML = orig + orig + orig;
    let x = 0, vel = 0, drag = false, lx = 0, last = window.scrollY;
    mq.addEventListener("pointerdown", (e) => { drag = true; lx = e.clientX; mq.setPointerCapture(e.pointerId); });
    mq.addEventListener("pointermove", (e) => { if (!drag) return; vel = (e.clientX - lx) * 0.9; x += e.clientX - lx; lx = e.clientX; });
    const up = () => (drag = false); mq.addEventListener("pointerup", up); mq.addEventListener("pointercancel", up);
    (function loop() {
      const s = window.__lenis ? __lenis.scroll : scrollY; const sv = (s - last); last = s;
      const w = tr.scrollWidth / 3;
      if (!drag) { vel *= 0.92; x -= 1.2 + Math.abs(sv) * 0.35 - vel * 0.05; }
      if (x <= -w) x += w; if (x > 0) x -= w;
      tr.style.transform = `translate3d(${x}px,0,0) skewX(${clamp(-sv * 0.4, -12, 12)}deg)`;
      if (!M.reduced) requestAnimationFrame(loop);
    })();
  }

  /* ---------- Drop horizontal ---------- */
  let dropST;
  function dropScene() {
    if (!hasGS) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 821px)", () => {
      const sec = $("#drop"), pin = $(".drop__pin", sec), track = $("[data-drop-track]"), bar = $("[data-drop-p]");
      const dist = () => track.scrollWidth - innerWidth + 40;
      const tw = gsap.to(track, { x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: sec, pin: pin, start: "top top", end: () => "+=" + dist(), scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: (s) => bar.style.setProperty("--p", s.progress) } });
      dropST = tw.scrollTrigger;
      return () => { tw.kill(); gsap.set(track, { x: 0 }); };
    });
  }

  /* ---------- Tunnel ---------- */
  function tunnel() {
    const sec = $("[data-tunnel]"); if (!sec) return;
    const space = $("[data-tunnel-space]", sec);
    const items = [["neon-2", "Neon study"], ["vr-man", "Hand tracking"], ["holo", "Spatial UI"], ["city", "Night city"], ["aura", "Aura One"], ["gamer", "Battle station"], ["vr-woman", "First contact"], ["watch-2", "Chrono S"], ["brain", "Neural Core"], ["tunnel", "Portal"], ["vr-3", "Immersion"], ["drone-2", "Volt 4K"], ["world", "Connected"], ["iem", "Hi-fi"], ["vr-4", "Mixed reality"], ["code", "Local AI"], ["audio-life", "Desk setup"], ["horizon-2", "Horizon X"], ["mesh", "Wireframe"], ["buds-2", "Pulse Buds"], ["wave-3", "Light study"], ["chip-mono", "Silicon"]];
    space.innerHTML = items.map((it) => `<figure class="tcard"><img src="${M.IMG}${it[0]}-sm.webp" alt="${it[1]}" loading="lazy"><figcaption class="t-nano">${it[1]}</figcaption></figure>`).join("");
    const cards = $$(".tcard", space), N = cards.length, GAP = 520, title = $(".tunnel__title", sec);
    const R = () => Math.min(innerWidth * 0.36, 520);
    const place = (p) => {
      const r = R(), travel = N * GAP + 900;
      cards.forEach((c, i) => {
        const a = i * 2.4 + p * 3.2;
        const z = -i * GAP - 600 + p * travel;
        const op = z < -5200 ? 0 : z > 650 ? 0 : z > 250 ? 1 - (z - 250) / 400 : Math.min(1, (z + 5200) / 1400);
        c.style.transform = `translate3d(${Math.cos(a) * r}px,${Math.sin(a) * r * 0.62}px,${z}px) rotateY(${-Math.cos(a) * 18}deg)`;
        c.style.opacity = op;
        c.style.zIndex = Math.round(z + 6000);
      });
      if (title) { title.style.transform = `scale(${0.9 + p * 0.35})`; title.style.opacity = p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1; }
    };
    place(0.12);
    if (hasGS) ScrollTrigger.create({ trigger: sec, start: "top top", end: "bottom bottom", scrub: true, onUpdate: (s) => place(s.progress), onEnter: () => $("[data-split]", title).classList.add("is-in") });
    else $("[data-split]", title).classList.add("is-in");
  }

  /* ---------- Warp ---------- */
  function warp() {
    const sec = $("[data-warp]"); if (!sec) return;
    const cv = $("[data-warp-lines]", sec), ctx = cv.getContext("2d");
    let w, h, prog = 0; const lines = [];
    const rs = () => { const dpr = Math.min(devicePixelRatio, 2); w = cv.width = cv.offsetWidth * dpr; h = cv.height = cv.offsetHeight * dpr; };
    rs(); addEventListener("resize", rs);
    for (let i = 0; i < 260; i++) lines.push({ a: Math.random() * Math.PI * 2, r: Math.random(), s: 0.3 + Math.random() });
    let vis = false; new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(sec);
    (function loop() {
      if (vis) {
        ctx.clearRect(0, 0, w, h);
        const sp = 0.002 + prog * prog * 0.05, cx = w / 2, cy = h / 2, maxR = Math.hypot(w, h) / 2;
        for (const l of lines) {
          l.r += sp * l.s; if (l.r > 1) l.r = Math.random() * 0.1;
          const r1 = l.r * maxR, r2 = Math.max(0, r1 - (20 + prog * 380) * l.s * l.r);
          ctx.strokeStyle = `rgba(${120 + prog * 100 | 0},${200 + prog * 40 | 0},255,${0.15 + l.r * 0.7})`; ctx.lineWidth = 1 + l.r * 2 * (1 + prog);
          ctx.beginPath(); ctx.moveTo(cx + Math.cos(l.a) * r2, cy + Math.sin(l.a) * r2); ctx.lineTo(cx + Math.cos(l.a) * r1, cy + Math.sin(l.a) * r1); ctx.stroke();
        }
      }
      if (!M.reduced) requestAnimationFrame(loop);
    })();
    const steps = $$(".step", sec), content = $("[data-warp-content]", sec), words = $$(".ww", sec), flash = $(".warp__flash", sec);
    if (!hasGS) { steps.forEach((s) => s.classList.add("is-on")); return; }
    gsap.set(words, { opacity: 0, scale: 0.5, filter: "blur(24px)" });
    ScrollTrigger.create({ trigger: sec, start: "top top", end: "bottom bottom", scrub: true,
      onEnter: () => $$("[data-split]", sec).forEach((x) => x.classList.add("is-in")),
      onUpdate: (s) => {
        prog = s.progress; const p = s.progress;
        steps.forEach((st, i) => st.classList.toggle("is-on", p > 0.08 + i * 0.12));
        const out = clamp((p - 0.6) / 0.08, 0, 1);
        content.style.opacity = 1 - out; content.style.transform = `scale(${1 - out * 0.15})`; content.style.filter = `blur(${out * 10}px)`;
        words.forEach((wd, i) => { const q = clamp((p - 0.66 - i * 0.07) / 0.08, 0, 1); gsap.set(wd, { opacity: q, scale: 0.5 + q * 0.5, filter: `blur(${(1 - q) * 24}px)` }); });
        const f = clamp((p - 0.9) / 0.05, 0, 1) * (1 - clamp((p - 0.96) / 0.04, 0, 1));
        flash.style.opacity = f * 0.8;
      } });
  }

  /* ---------- Closing planet ---------- */
  function planet() {
    const cv = $("[data-planet]"); if (!cv) return;
    const ctx = cv.getContext("2d"); let w, h, dpr; const stars = [];
    const rs = () => { dpr = Math.min(devicePixelRatio, 2); w = cv.width = cv.offsetWidth * dpr; h = cv.height = cv.offsetHeight * dpr; };
    rs(); addEventListener("resize", rs);
    for (let i = 0; i < 220; i++) stars.push([Math.random(), Math.random(), Math.random()]);
    let vis = false, t = 0; new IntersectionObserver((e) => (vis = e[0].isIntersecting)).observe(cv);
    (function loop() {
      if (vis) {
        t += 0.005; ctx.clearRect(0, 0, w, h);
        for (const s of stars) { ctx.fillStyle = `rgba(200,230,255,${0.2 + 0.6 * Math.abs(Math.sin(t * 3 + s[2] * 10))})`; ctx.fillRect(s[0] * w, s[1] * h * 0.75, 1.4 * dpr * s[2], 1.4 * dpr * s[2]); }
        const R = Math.max(w, h) * 0.62, cx = w * 0.62, cy = h + R * 0.55;
        const atm = ctx.createRadialGradient(cx, cy, R * 0.9, cx, cy, R * 1.22);
        atm.addColorStop(0, "rgba(61,139,255,.55)"); atm.addColorStop(0.35, "rgba(127,232,255,.18)"); atm.addColorStop(1, "rgba(42,91,255,0)");
        ctx.fillStyle = atm; ctx.beginPath(); ctx.arc(cx, cy, R * 1.22, 0, Math.PI * 2); ctx.fill();
        const body = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.9, R * 0.1, cx, cy, R);
        body.addColorStop(0, "#1b3f9a"); body.addColorStop(0.45, "#071433"); body.addColorStop(1, "#02040b");
        ctx.fillStyle = body; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
        ctx.strokeStyle = "rgba(127,232,255,.10)"; ctx.lineWidth = dpr;
        for (let i = 0; i < 18; i++) { const yy = cy - R + (i / 18) * R * 0.9; ctx.beginPath(); ctx.ellipse(cx, yy + R * 0.02 * Math.sin(t + i), R * (0.3 + i * 0.04), R * 0.02 * (i + 1), 0, 0, Math.PI * 2); ctx.stroke(); }
        for (let i = 0; i < 14; i++) { const a = t * 0.4 + i * 0.45; ctx.beginPath(); ctx.ellipse(cx, cy, Math.abs(Math.cos(a)) * R, R, 0, 0, Math.PI * 2); ctx.stroke(); }
        ctx.restore();
        ctx.strokeStyle = "rgba(127,232,255,.9)"; ctx.lineWidth = 2 * dpr; ctx.shadowColor = "#7fe8ff"; ctx.shadowBlur = 24 * dpr;
        ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 1.08, Math.PI * 1.92); ctx.stroke(); ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(127,232,255,.35)"; ctx.lineWidth = dpr; ctx.beginPath(); ctx.ellipse(cx, cy - R * 0.55, R * 1.35, R * 0.16, -0.12, 0, Math.PI * 2); ctx.stroke();
        const sa = t * 1.4; const sx = cx + Math.cos(sa) * R * 1.35, sy = cy - R * 0.55 + Math.sin(sa) * R * 0.16;
        ctx.fillStyle = "#fff"; ctx.shadowColor = "#7fe8ff"; ctx.shadowBlur = 20 * dpr; ctx.beginPath(); ctx.arc(sx, sy, 4 * dpr, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
      }
      if (!M.reduced) requestAnimationFrame(loop);
    })();
  }

  /* ---------- helpers ---------- */
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const secProg = (sec) => { const r = sec.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
  const onVisible = (el, cb) => { let v = false; new IntersectionObserver((e) => (v = e[0].isIntersecting), { rootMargin: "200px" }).observe(el); (function loop() { if (v) cb(); requestAnimationFrame(loop); })(); };

  /* ---------- Kinetic type: letters assemble then blast past the camera ---------- */
  let kinChars = [];
  function kinSplit() {
    const w = $("[data-kin-word]"); if (!w) return;
    const html = w.innerHTML; const plain = html.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
    w.setAttribute("aria-label", plain.replace(/\n/g, " "));
    const lines = plain.split("\n");
    w.innerHTML = lines.map((ln, li) => [...ln].map((ch) => ch === " " ? " " : `<span class="kc${li === lines.length - 1 ? " acc" : ""}" aria-hidden="true">${ch}</span>`).join("")).join("<br>");
    kinChars = $$(".kc", w).map((el) => ({ el, vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, vz: Math.random(), rx: (Math.random() - 0.5) * 2, ry: (Math.random() - 0.5) * 2, rz: (Math.random() - 0.5) * 2 }));
  }
  function kinetic() {
    const sec = $("[data-kin]"); if (!sec) return;
    kinSplit();
    const sub = $(".kin__sub", sec), n = $("[data-kin-n]", sec);
    if (M.reduced) return;
    onVisible(sec, () => {
      const p = secProg(sec);
      const a = 1 - smooth(0.04, 0.42, p), b = smooth(0.62, 0.97, p);
      kinChars.forEach((c) => {
        const x = c.vx * (a * 700 + b * 1100), y = c.vy * (a * 420 + b * 700), z = -c.vz * a * 1800 + b * (900 + c.vz * 1400);
        c.el.style.transform = `translate3d(${x}px,${y}px,${z}px) rotateX(${c.rx * (a * 200 + b * 120)}deg) rotateY(${c.ry * (a * 200 + b * 140)}deg) rotateZ(${c.rz * (a * 90 + b * 60)}deg)`;
        c.el.style.opacity = (1 - a * 0.92) * (1 - b * 0.95);
      });
      if (sub) sub.style.opacity = smooth(0.36, 0.46, p) * (1 - smooth(0.6, 0.7, p));
      if (n) n.textContent = String(Math.round(p * 100)).padStart(3, "0");
    });
  }

  /* ---------- Wireframe globe (spins faster as you scroll) ---------- */
  function globe() {
    const cv = $("[data-globe]"); if (!cv) return;
    const ctx = cv.getContext("2d"); let w, h, dpr, rot = 0, last = scrollY;
    const rs = () => { dpr = Math.min(devicePixelRatio, 2); w = cv.width = cv.offsetWidth * dpr; h = cv.height = cv.offsetHeight * dpr; };
    rs(); addEventListener("resize", rs);
    const sec = $("[data-kin]");
    const proj = (lat, lon, R, cx, cy, tilt) => {
      let x = Math.cos(lat) * Math.sin(lon + rot), y = Math.sin(lat), z = Math.cos(lat) * Math.cos(lon + rot);
      const y2 = y * Math.cos(tilt) - z * Math.sin(tilt), z2 = y * Math.sin(tilt) + z * Math.cos(tilt);
      const s = 1 / (1.6 - z2 * 0.35);
      return [cx + x * R * s, cy - y2 * R * s, z2];
    };
    onVisible(cv, () => {
      const s = window.__lenis ? __lenis.scroll : scrollY, v = Math.abs(s - last); last = s;
      const p = sec ? secProg(sec) : 0;
      rot += 0.003 + Math.min(v, 120) * 0.0009;
      ctx.clearRect(0, 0, w, h);
      const R = Math.min(w, h) * (0.5 + p * 0.15), cx = w / 2, cy = h / 2, tilt = 0.35;
      ctx.lineWidth = dpr;
      const seg = (pts) => { for (let i = 1; i < pts.length; i++) { const [x1, y1, z1] = pts[i - 1], [x2, y2] = pts[i]; ctx.strokeStyle = z1 > 0 ? "rgba(127,232,255,.42)" : "rgba(61,139,255,.12)"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); } };
      for (let la = -75; la <= 75; la += 15) { const pts = []; for (let lo = 0; lo <= 360; lo += 6) pts.push(proj(la * Math.PI / 180, lo * Math.PI / 180, R, cx, cy, tilt)); seg(pts); }
      for (let lo = 0; lo < 360; lo += 15) { const pts = []; for (let la = -90; la <= 90; la += 6) pts.push(proj(la * Math.PI / 180, lo * Math.PI / 180, R, cx, cy, tilt)); seg(pts); }
      for (let la = -60; la <= 60; la += 30) for (let lo = 0; lo < 360; lo += 30) { const [x, y, z] = proj(la * Math.PI / 180, lo * Math.PI / 180, R, cx, cy, tilt); if (z > 0.2) { ctx.fillStyle = "#7fe8ff"; ctx.shadowColor = "#7fe8ff"; ctx.shadowBlur = 10 * dpr; ctx.beginPath(); ctx.arc(x, y, 2 * dpr, 0, 7); ctx.fill(); ctx.shadowBlur = 0; } }
      ctx.strokeStyle = "rgba(127,232,255,.55)"; ctx.lineWidth = 1.4 * dpr; ctx.beginPath(); ctx.ellipse(cx, cy, R * 1.35, R * 0.28, -0.25, 0, Math.PI * 2); ctx.stroke();
      const sa = rot * 3, sx = cx + Math.cos(sa) * R * 1.35 * Math.cos(-0.25) - Math.sin(sa) * R * 0.28 * Math.sin(-0.25), sy = cy + Math.cos(sa) * R * 1.35 * Math.sin(-0.25) + Math.sin(sa) * R * 0.28 * Math.cos(-0.25);
      ctx.fillStyle = "#fff"; ctx.shadowColor = "#7fe8ff"; ctx.shadowBlur = 24 * dpr; ctx.beginPath(); ctx.arc(sx, sy, 5 * dpr, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
    });
  }

  /* ---------- Orbit: 3D ring of products driven by scroll + drag ---------- */
  let orbitState = null;
  function orbitInfo(force) {
    const S = orbitState; if (!S) return;
    const p = M.products[S.front];
    if (!force && S.shown === S.front) return; S.shown = S.front;
    const txt = $("[data-orbit-txt]"), buy = $("[data-orbit-buy]");
    txt.innerHTML = `<span class="t-nano" style="color:var(--cyan)">${M.tr(p.catLabel)} · ${p.no}/06</span><h3>${p.name}</h3><p>${M.tr(p.short)}</p>`;
    buy.innerHTML = `<p class="price tnum" style="font-size:clamp(22px,2.2vw,32px)">${M.eur(p.price)}</p><button class="btn btn--ghost btn--sm" type="button" data-qv="${p.id}"><span class="roll"><span>${M.T("Details", "Detalles")}</span><span aria-hidden="true">${M.T("Details", "Detalles")}</span></span><span class="btn__ico">${M.ARROW}</span></button><button class="add" type="button" data-add="${p.id}"><span>${M.T("Add", "Añadir")}</span><i>+</i></button>`;
    [txt, buy].forEach((e) => { e.classList.remove("swap"); void e.offsetWidth; e.classList.add("swap"); });
    $("[data-orbit-num]").textContent = p.no;
    $$("[data-orbit-dots] button").forEach((b, i) => b.classList.toggle("is-on", i === S.front));
    S.cards.forEach((c, i) => c.classList.toggle("is-front", i === S.front));
  }
  function orbit() {
    const sec = $("[data-orbit]"); if (!sec) return;
    const ring = $("[data-orbit-ring]", sec), scene = $("[data-orbit-scene]", sec), P = M.products, STEP = 360 / P.length;
    ring.innerHTML = P.map((p, i) => `<figure class="ocard" data-i="${i}"><img src="${M.IMG}${p.img[0]}-sm.webp" srcset="${M.IMG}${p.img[0]}-sm.webp 480w, ${M.IMG}${p.img[0]}.webp 1080w" sizes="300px" alt="MRB ${p.name}" draggable="false"><figcaption class="ocard__cap"><b>${p.name}</b><span>${M.eur(p.price)}</span></figcaption></figure>`).join("");
    $("[data-orbit-dots]").innerHTML = P.map((p, i) => `<button type="button" aria-label="${p.name}" data-od="${i}"></button>`).join("");
    const cards = $$(".ocard", ring);
    const S = (orbitState = { cards, rot: 0, drag: 0, front: 0, shown: -1, R: 400 });
    const layout = () => {
      const cw = innerWidth < 820 ? Math.max(150, innerWidth * 0.42) : clamp(Math.min(innerWidth * 0.19, innerHeight * 0.36), 220, 330);
      S.R = innerWidth < 820 ? cw * 1.25 : cw * 1.7;
      ring.style.setProperty("--cw", cw + "px");
      cards.forEach((c, i) => (c.style.transform = `rotateY(${i * STEP}deg) translateZ(${S.R}px)`));
    };
    layout(); addEventListener("resize", layout);
    let dragging = false, lx = 0, moved = 0;
    scene.addEventListener("pointerdown", (e) => { dragging = true; lx = e.clientX; moved = 0; });
    addEventListener("pointermove", (e) => { if (!dragging) return; const dx = e.clientX - lx; lx = e.clientX; moved += Math.abs(dx); S.drag += dx * 0.35; });
    addEventListener("pointerup", () => { if (!dragging) return; dragging = false; const sr = -secProg(sec) * 360; S.drag = Math.round((sr + S.drag) / STEP) * STEP - sr; });
    const goTo = (i) => { const sr = -secProg(sec) * 360, cur = sr + S.drag; let target = -i * STEP; target += Math.round((cur - target) / 360) * 360; S.drag = target - sr; };
    ring.addEventListener("click", (e) => { if (moved > 6) return; const c = e.target.closest(".ocard"); if (!c) return; const i = +c.dataset.i; if (i === S.front) M.quickView(P[i].id); else goTo(i); });
    $("[data-orbit-dots]").addEventListener("click", (e) => { const b = e.target.closest("[data-od]"); if (b) goTo(+b.dataset.od); });
    orbitInfo(true);
    const step = () => {
      const target = -secProg(sec) * 360 + S.drag;
      S.rot += (target - S.rot) * (M.reduced ? 1 : 0.08);
      ring.style.transform = `rotateX(-8deg) rotateY(${S.rot}deg)`;
      let best = -2, bi = 0;
      cards.forEach((c, i) => {
        const cos = Math.cos(((i * STEP + S.rot) * Math.PI) / 180);
        if (cos > best) { best = cos; bi = i; }
        const k = (cos + 1) / 2;
        c.style.opacity = 0.18 + 0.82 * Math.pow(k, 1.6);
        c.style.filter = `blur(${(1 - k) * 3}px) brightness(${0.5 + k * 0.6})`;
      });
      if (bi !== S.front) { S.front = bi; orbitInfo(); }
    };
    onVisible(sec, step);
  }

  /* ---------- Statement floaters spin in 3D ---------- */
  function floaters3d() {
    if (!hasGS) return;
    $$(".floater").forEach((f, i) => gsap.fromTo(f, { rotationY: i % 2 ? -60 : 60, rotationX: 20, transformPerspective: 800 }, { rotationY: i % 2 ? 300 : -300, rotationX: -20, ease: "none", scrollTrigger: { trigger: ".statement", start: "top bottom", end: "bottom top", scrub: 1 } }));
  }


  /* ---------- Boot ---------- */
  wrapScrub(); miniCal();
  scrubScene(); worlds(); marquee(); tunnel(); warp(); planet(); kinetic(); globe(); orbit(); floaters3d();
  d.addEventListener("mrb:lang", () => {
    wrapScrub(); scrubScene(); miniCal(); kinSplit(); orbitInfo(true);
    $$(".depth__title,.tunnel__title [data-split],[data-warp] [data-split]").forEach((x) => x.classList.add("is-in"));
    if (hasGS) ScrollTrigger.refresh();
  });
  addEventListener("load", () => hasGS && ScrollTrigger.refresh());
})();
