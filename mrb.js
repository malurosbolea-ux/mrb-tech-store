/* =========================================================
   MRB core — chrome, i18n, motion, cart
   ========================================================= */
(function () {
  "use strict";
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const PRODUCTS = window.MRB_PRODUCTS || [];
  const IMG = "";
  const page = d.body.dataset.page || "home";

  /* ---------------- i18n ---------------- */
  let lang = "en";
  try { lang = localStorage.getItem("mrb-lang") || "en"; } catch (e) {}
  if (lang !== "es") lang = "en";
  const tr = (o) => (o == null ? "" : typeof o === "string" ? o : (o[lang] || o.en));
  const T = (en, es) => (lang === "es" ? es : en);
  const eur = (n) => new Intl.NumberFormat(lang === "es" ? "es-ES" : "en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);

  /* ---------------- icons ---------------- */
  const ARROW = '<svg class="arrow" viewBox="0 0 10 10" aria-hidden="true"><path d="M1 9 9 1M3 1h6v6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>';
  const ICON = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  const btn = (cls, href, label, extra = "") =>
    `<a class="btn ${cls}" href="${href}" ${extra}><span class="roll"><span>${label}</span><span aria-hidden="true">${label}</span></span><span class="btn__ico">${ARROW}</span></a>`;

  /* ---------------- Animated MRB logo ---------------- */
  const LG = {
    m: "M0 100V0h30l30 44 30-44h30v100H94V46L66 86H54L26 46v54z",
    r: "M132 0h64c20 0 31 12 31 29 0 14-8 25-21 28l24 43h-29l-21-40h-22v40h-26zm26 21v19h36c6 0 8-4 8-9.5S200 21 194 21z",
    b: "M240 0h63c19 0 29 10 29 25 0 10-5 17-12 21 10 4 16 12 16 25 0 18-12 29-32 29h-64zm26 20v20h34c5 0 7-3 7-10s-2-10-7-10zm0 39v21h38c6 0 8-4 8-10.5s-2-10.5-8-10.5z"
  };
  let lgN = 0;
  function logoSVG(opt = {}) {
    const id = "lg" + (++lgN), bands = opt.bands || 0;
    const letters = `<g class="lg-trails"><rect class="lg-trail" x="-62" y="10" width="44" height="7" rx="1"/><rect class="lg-trail" x="-46" y="46" width="30" height="7" rx="1"/><rect class="lg-trail" x="-54" y="82" width="38" height="7" rx="1"/></g><path class="lg-l lg-m" d="${LG.m}"/><path class="lg-l lg-r" d="${LG.r}"/><path class="lg-l lg-b" d="${LG.b}"/>`;
    let body;
    if (bands) {
      const h = 112 / bands; let clips = "", groups = "";
      for (let i = 0; i < bands; i++) {
        clips += `<clipPath id="${id}c${i}" clipPathUnits="userSpaceOnUse"><rect x="-300" y="${(-6 + i * h).toFixed(2)}" width="900" height="${(h + 0.6).toFixed(2)}"/></clipPath>`;
        groups += `<g clip-path="url(#${id}c${i})"><g class="lg-band"><use href="#${id}L"/></g></g>`;
      }
      body = `<defs>${clips}<g id="${id}L">${letters}</g></defs>${groups}`;
    } else body = letters;
    return `<svg class="mrb-logo" viewBox="-94 -6 460 112" role="img" aria-label="MRB">
      <defs>
        <linearGradient id="${id}g" gradientUnits="userSpaceOnUse" x1="-60" y1="0" x2="340" y2="0">
          <stop offset="0" stop-color="#7fe8ff"/><stop offset=".4" stop-color="#3d8bff"/><stop offset=".5" stop-color="#eafcff"/><stop offset=".6" stop-color="#3d8bff"/><stop offset="1" stop-color="#2a5bff"/>
          ${reduced ? "" : `<animateTransform attributeName="gradientTransform" type="translate" values="-460 0;460 0" dur="3.2s" repeatCount="indefinite"/>`}
        </linearGradient>
        <mask id="${id}m" maskUnits="userSpaceOnUse" x="-120" y="-10" width="520" height="130">
          <rect x="-120" y="-10" width="520" height="130" fill="#fff"/>
          <rect x="-120" y="56" width="520" height="2" fill="#000"/><rect x="-120" y="66" width="520" height="3" fill="#000"/><rect x="-120" y="77" width="520" height="4.5" fill="#000"/><rect x="-120" y="89" width="520" height="6" fill="#000"/>
          <rect x="-120" y="-10" width="520" height="2.5" fill="#000">${reduced ? "" : `<animate attributeName="y" values="-10;110" dur="2.4s" repeatCount="indefinite"/>`}</rect>
        </mask>
      </defs>
      <g transform="skewX(-14)" fill="url(#${id}g)" fill-rule="evenodd" mask="url(#${id}m)">${body}</g>
      <circle class="lg-dot" cx="349" cy="88" r="12" fill="#7fe8ff"/>
    </svg>`;
  }

  /* ---------------- chrome templates ---------------- */
  const NAV = [
    ["index.html", "home", "Home", "Inicio"],
    ["shop.html", "shop", "Shop", "Tienda"],
    ["vr-demo.html", "demo", "VR Demo", "Demo VR"],
    ["lab.html", "lab", "The Lab", "El Lab"],
    ["contact.html", "contact", "Contact", "Contacto"]
  ];
  function chromeTop() {
    return `
<a class="skip" href="#main">${T("Skip to content", "Saltar al contenido")}</a>
<div class="cursor" aria-hidden="true"><div class="cursor__dot"></div><div class="cursor__ring"></div><span class="cursor__lab"></span></div>
<header class="nav" id="nav">
  <div class="wrap nav__in">
    <a class="logo" href="index.html" aria-label="MRB, home">${logoSVG()}</a>
    <div class="nav__end">
      <span class="nav__time"><i class="nav__dot" aria-hidden="true"></i><span>MAD</span> <span data-clock>--:--</span></span>
      <div class="lang" role="group" aria-label="Language"><button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button><button type="button" data-lang="es" aria-pressed="${lang === "es"}">ES</button></div>
      <span class="btn--nav">${btn("btn--light btn--sm", "vr-demo.html#book", T("Book a demo", "Reserva demo"), "data-magnetic")}</span>
      <button class="icon-btn" type="button" data-cart-open aria-label="${T("Open cart", "Abrir carrito")}">${ICON.bag}<span class="cart-count tnum" data-cart-count>0</span></button>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu" data-menu><span class="menu-btn__t">${T("Menu", "Menú")}</span><span class="menu-btn__i"><i></i><i></i></span></button>
    </div>
  </div>
</header>
<div class="menu" id="menu" aria-hidden="true">
  <div class="menu__bg"><div class="menu__blob"></div><div class="scan"></div></div>
  <div class="menu__in wrap">
    <nav class="menu__grid" aria-label="${T("All pages", "Todas las páginas")}">
      <ul class="menu__links">
        ${NAV.map((n, i) => `<li><a href="${n[0]}" ${page === n[1] ? 'aria-current="page"' : ""}><sup>0${i + 1}</sup><span class="ml"><span>${T(n[2], n[3])}</span></span></a></li>`).join("")}
      </ul>
      <div class="menu__side">
        <div><p class="t-nano faint">${T("Shop by world", "Compra por mundo")}</p><ul style="margin-top:12px">
          <li><a class="link" href="shop.html?c=vr">${T("VR & mixed reality", "VR y realidad mixta")}</a></li>
          <li><a class="link" href="shop.html?c=audio">Audio</a></li>
          <li><a class="link" href="shop.html?c=wear">Wearables</a></li>
          <li><a class="link" href="shop.html?c=drone">Drones</a></li>
          <li><a class="link" href="shop.html?c=ai">${T("AI hardware", "Hardware IA")}</a></li></ul></div>
        <div><p class="t-nano faint">${T("Made by", "Hecho por")}</p><ul style="margin-top:12px">
          <li><a class="link" href="https://malurosbolea-ux.github.io/digital-strategy-portfolio/" target="_blank" rel="noopener">María Luisa Ros Bolea ↗</a></li>
          <li><a class="link" href="https://www.linkedin.com/in/marialuisarosbolea/" target="_blank" rel="noopener">LinkedIn ↗</a></li></ul></div>
      </div>
    </nav>
    <div class="menu__foot">
      ${btn("btn--primary", "vr-demo.html#book", T("Book your VR demo", "Reserva tu demo VR"))}
      <span class="t-micro dim">© 2026 MRB · ${T("Concept store for a portfolio", "Tienda concepto para un portfolio")}</span>
    </div>
  </div>
</div>
<div class="scrim" data-scrim></div>
<aside class="drawer" id="cart" aria-label="${T("Cart", "Carrito")}" aria-hidden="true">
  <div class="drawer__head"><h2>${T("Your bag", "Tu carrito")} <span class="t-nano dim" data-cart-n></span></h2><button class="icon-btn" type="button" data-cart-close aria-label="${T("Close", "Cerrar")}">${ICON.close}</button></div>
  <div class="drawer__body" data-cart-body></div>
  <div class="drawer__foot" data-cart-foot></div>
</aside>
<div class="modal" id="modal" aria-hidden="true" role="dialog" aria-modal="true"><div class="modal__card"><button class="icon-btn modal__close" type="button" data-modal-close aria-label="${T("Close", "Cerrar")}">${ICON.close}</button><div data-modal-body></div></div></div>
<div class="toasts" aria-live="polite"></div>`;
  }

  function chromeFoot() {
    return `
<div class="wrap">
  <div class="foot__top">
    <p class="foot__claim">${T("See further.", "Ve más allá.")}<br><span class="acc">${T("Move faster.", "Muévete más rápido.")}</span></p>
    ${btn("btn--primary", "shop.html", T("Shop the drop", "Ver la colección"), "data-magnetic")}
  </div>
  <div class="foot__cols">
    <div><h2 class="foot__h">${T("Flagship store", "Tienda insignia")}</h2><ul>
      <li>MRB Lab Madrid</li><li class="dim">Calle de Fuencarral 120</li><li class="dim">28010 Madrid, ${T("Spain", "España")}</li>
      <li class="dim" style="margin-top:8px">${T("Mon–Sat · 10:00–21:00", "Lun–Sáb · 10:00–21:00")}</li></ul></div>
    <div><h2 class="foot__h">${T("Shop", "Tienda")}</h2><ul>
      <li><a class="link" href="shop.html?c=vr">${T("VR & MR", "VR y RM")}</a></li><li><a class="link" href="shop.html?c=audio">Audio</a></li>
      <li><a class="link" href="shop.html?c=wear">Wearables</a></li><li><a class="link" href="shop.html?c=drone">Drones</a></li><li><a class="link" href="shop.html?c=ai">${T("AI hardware", "Hardware IA")}</a></li></ul></div>
    <div><h2 class="foot__h">${T("Explore", "Explora")}</h2><ul>
      ${NAV.map((n) => `<li><a class="link" href="${n[0]}">${T(n[2], n[3])}</a></li>`).join("")}</ul></div>
    <div><h2 class="foot__h">${T("Contact", "Contacto")}</h2><ul>
      <li><a class="link" href="mailto:malurosbolea@gmail.com">malurosbolea@gmail.com</a></li>
      <li><a class="link" href="tel:+34600000000">+34 600 000 000</a></li>
      <li style="margin-top:10px" class="dim">${T("Drops, early access, no spam:", "Lanzamientos y acceso anticipado, sin spam:")}</li>
      <li><form class="newsletter" data-newsletter><input type="email" required placeholder="${T("your@email.com", "tu@email.com")}" aria-label="Email"><button class="btn btn--light btn--sm" type="submit"><span class="roll"><span>${T("Join", "Unirme")}</span><span aria-hidden="true">${T("Join", "Unirme")}</span></span></button></form></li></ul></div>
  </div>
  <a class="foot__big" href="index.html" aria-label="MRB" data-cursor="Home">${logoSVG()}</a>
  <div class="foot__base">
    <span>© 2026 MRB Tech Store</span>
    <span class="foot__credit">${T("Concept brand designed &amp; built by", "Marca concepto diseñada y desarrollada por")} <a href="https://malurosbolea-ux.github.io/digital-strategy-portfolio/" target="_blank" rel="noopener">María Luisa Ros Bolea</a> · ${T("Not a real store", "No es una tienda real")}</span>
    <span class="tnum">40.43° N 3.70° W · MAD <span data-clock>--:--</span></span>
    <a href="https://www.linkedin.com/in/marialuisarosbolea/" target="_blank" rel="noopener">LinkedIn ↗</a>
  </div>
</div>`;
  }

  /* ---------------- Intro + door transitions ---------------- */
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const anim = (el, kf, o) => (el && el.animate ? el.animate(kf, Object.assign({ fill: "forwards" }, o)).finished.catch(() => {}) : Promise.resolve());
  function introMarkup(quick) {
    const ring = (r, dash, op) => `<svg viewBox="0 0 200 200" fill="none"><circle cx="100" cy="100" r="${r}" stroke="rgba(127,232,255,${op})" stroke-width=".6" stroke-dasharray="${dash}"/><circle cx="100" cy="${100 - r}" r="1.6" fill="#7fe8ff"/></svg>`;
    return `<div class="intro__door intro__door--t"><div class="scan"></div></div><div class="intro__door intro__door--b"><div class="scan"></div></div>
      <div class="intro__floor"></div>
      <div class="intro__ring">${ring(96, "2 6", 0.35)}${ring(96, "40 12 4 12", 0.45)}</div>
      <div class="intro__corners"><span></span><span></span><span></span><span></span></div>
      <div class="intro__stage">${logoSVG({ bands: quick ? 0 : 14 })}</div>
      <div class="intro__line"></div>
      <div class="intro__hud"><span data-ih></span><span data-ih></span><span data-ih></span><span data-ih></span></div>
      <span class="intro__n tnum">000</span><i class="intro__bar"></i>
      <button class="intro__skip" type="button">${T("Skip intro", "Saltar intro")} →</button>`;
  }
  let introEl;
  function typeLine(el, txt, speed) {
    return new Promise((res) => { let i = 0; (function t() { el.innerHTML = txt.slice(0, i) + (i < txt.length ? "<b>▌</b>" : ""); if (i++ < txt.length) setTimeout(t, speed); else res(); })(); });
  }
  async function openDoors(fast) {
    const it = introEl, stage = $(".intro__stage", it), line = $(".intro__line", it);
    it.classList.add("is-lit");
    await anim(line, [{ transform: "scaleX(0)", opacity: 0 }, { transform: "scaleX(1)", opacity: 1 }], { duration: fast ? 260 : 420, easing: "cubic-bezier(.7,0,.3,1)" });
    const main = $("#main"), dur = fast ? 900 : 1300, ease = "cubic-bezier(.86,0,.07,1)";
    root.classList.add("ld-done");
    d.dispatchEvent(new CustomEvent("mrb:open"));
    const ps = [
      anim($(".intro__door--t", it), [{ transform: "translateY(0)" }, { transform: "translateY(-101%)" }], { duration: dur, easing: ease }),
      anim($(".intro__door--b", it), [{ transform: "translateY(0)" }, { transform: "translateY(101%)" }], { duration: dur, easing: ease }),
      anim(stage, [{ transform: "translate(-50%,-50%) scale(1)", opacity: 1 }, { transform: "translate(-50%,-50%) scale(7)", opacity: 0 }], { duration: dur * 0.85, easing: "cubic-bezier(.7,0,.84,0)" }),
      anim(line, [{ opacity: 1, transform: "scaleX(1) scaleY(1)" }, { opacity: 0, transform: "scaleX(1.2) scaleY(30)" }], { duration: dur * 0.5, easing: "ease-out" })
    ];
    $$(".intro__ring,.intro__floor,.intro__hud,.intro__n,.intro__bar,.intro__skip,.intro__corners", it).forEach((e) => ps.push(anim(e, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 })));
    if (main && !reduced && main.animate) main.animate([{ transform: "scale(1.14)", filter: "blur(14px) brightness(2)" }, { transform: "scale(1)", filter: "blur(0) brightness(1)" }], { duration: dur + 200, easing: "cubic-bezier(.16,1,.3,1)" });
    setTimeout(() => d.dispatchEvent(new CustomEvent("mrb:loaded")), dur * 0.35);
    await Promise.all(ps);
    it.classList.add("is-done");
    if (window.__lenis) __lenis.start();
  }
  async function intro() {
    introEl = $("#intro");
    if (!introEl) { introEl = d.createElement("div"); introEl.className = "intro"; introEl.id = "intro"; d.body.prepend(introEl); }
    let full = false;
    try { full = page === "home" && !sessionStorage.getItem("mrb-intro"); sessionStorage.setItem("mrb-intro", "1"); } catch (e) {}
    if (reduced) { introEl.classList.add("is-done"); root.classList.add("ld-done"); d.dispatchEvent(new CustomEvent("mrb:open")); setTimeout(() => d.dispatchEvent(new CustomEvent("mrb:loaded")), 50); return; }
    introEl.innerHTML = introMarkup(!full);
    introEl.classList.toggle("is-quick", !full);
    if (window.__lenis) { __lenis.stop(); __lenis.scrollTo(0, { immediate: true }); } else scrollTo(0, 0);
    const svg = $(".mrb-logo", introEl);
    if (!full) { svg.classList.add("is-glitch"); await wait(420); return openDoors(true); }

    let skip = false;
    const skipP = new Promise((r) => $(".intro__skip", introEl).addEventListener("click", () => { skip = true; r(); }, { once: true }));
    introEl.classList.add("is-on");
    const n = $(".intro__n", introEl), bar = $(".intro__bar", introEl), t0 = performance.now(), TOTAL = 3000;
    let raf;
    (function count() { const p = Math.min(1, (performance.now() - t0) / TOTAL); n.textContent = String(Math.floor(p * 100)).padStart(3, "0"); bar.style.setProperty("--p", p); if (p < 1 && !skip) raf = requestAnimationFrame(count); })();
    const hl = $$("[data-ih]", introEl);
    (async () => {
      const lines = [T("> boot mrb/os 26.11", "> arrancando mrb/os 26.11"), T("> calibrating 4k micro-oled ....... ok", "> calibrando micro-oled 4k ........ ok"), T("> eye + hand tracking ............. ok", "> seguimiento ojos + manos ........ ok"), T("> madrid lab · <b>online</b>", "> lab madrid · <b>online</b>")];
      for (let i = 0; i < lines.length && !skip; i++) await typeLine(hl[i], lines[i], 12);
    })();
    const bands = $$(".lg-band", svg), dot = $(".lg-dot", svg);
    const starts = bands.map(() => `translateX(${-900 - Math.random() * 1000}px) scaleX(${2.5 + Math.random() * 2})`);
    bands.forEach((b, i) => { b.style.transform = starts[i]; b.style.opacity = 0; });
    dot.style.opacity = 0;
    await Promise.race([wait(250), skipP]);
    const fly = bands.map((b, i) => anim(b, [{ transform: starts[i], opacity: 0 }, { opacity: 1, offset: 0.15 }, { transform: "translateX(0) scaleX(1)", opacity: 1 }], { duration: 950 + Math.random() * 450, delay: i * 50 + Math.random() * 140, easing: "cubic-bezier(.16,1,.3,1)" }));
    await Promise.race([Promise.all(fly), skipP]);
    if (!skip) {
      await Promise.race([anim(dot, [{ transform: "translateY(-260px)", opacity: 0 }, { transform: "translateY(0)", opacity: 1, offset: 0.6 }, { transform: "translateY(-26px)", offset: 0.8 }, { transform: "translateY(0)", opacity: 1 }], { duration: 650, easing: "ease-in" }), skipP]);
      svg.classList.add("is-glitch");
      await Promise.race([wait(560), skipP]); svg.classList.remove("is-glitch");
      const left = TOTAL - (performance.now() - t0); if (left > 0) await Promise.race([wait(left), skipP]);
    }
    bands.forEach((b) => { b.getAnimations().forEach((a) => a.cancel()); b.style.transform = "none"; b.style.opacity = 1; });
    dot.getAnimations().forEach((a) => a.cancel()); dot.style.opacity = 1; dot.style.transform = "";
    cancelAnimationFrame(raf); n.textContent = "100"; bar.style.setProperty("--p", 1);
    await openDoors(false);
  }
  async function closeDoors(href) {
    if (!introEl) { location.href = href; return; }
    introEl.classList.remove("is-done", "is-lit", "is-on"); introEl.classList.add("is-quick");
    introEl.innerHTML = introMarkup(true);
    const stage = $(".intro__stage", introEl); stage.style.opacity = 0;
    const ease = "cubic-bezier(.86,0,.07,1)";
    await Promise.all([
      anim($(".intro__door--t", introEl), [{ transform: "translateY(-101%)" }, { transform: "translateY(0)" }], { duration: 620, easing: ease }),
      anim($(".intro__door--b", introEl), [{ transform: "translateY(101%)" }, { transform: "translateY(0)" }], { duration: 620, easing: ease })
    ]);
    stage.style.opacity = 1; $(".mrb-logo", introEl).classList.add("is-glitch");
    await wait(160);
    location.href = href;
  }
  d.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]"); if (!a || e.defaultPrevented || reduced) return;
    if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.hasAttribute("download")) return;
    const href = a.getAttribute("href"); if (!href || href.startsWith("#") || /^(mailto|tel):/.test(href)) return;
    const url = new URL(href, location.href); if (url.origin !== location.origin) return;
    if (url.pathname === location.pathname && url.search === location.search) return;
    e.preventDefault(); closeDoors(url.href);
  });
  addEventListener("pageshow", (e) => { if (e.persisted && introEl) introEl.classList.add("is-done"); });

  /* ---------------- Text splitting ---------------- */
  function split(el) {
    if (!el.dataset.src) el.dataset.src = el.innerHTML;
    const html = el.dataset.src;
    const tmp = d.createElement("div"); tmp.innerHTML = html;
    let i = 0;
    const walk = (node) => {
      const out = [];
      node.childNodes.forEach((c) => {
        if (c.nodeType === 3) {
          c.textContent.split(/(\s+)/).forEach((tok) => {
            if (!tok) return;
            if (/^\s+$/.test(tok)) out.push(d.createTextNode(" "));
            else { const w = d.createElement("span"); w.className = "w"; const wi = d.createElement("span"); wi.className = "wi"; wi.style.setProperty("--i", i++); wi.textContent = tok; w.appendChild(wi); out.push(w); }
          });
        } else if (c.nodeName === "BR") out.push(c.cloneNode());
        else if (c.nodeType === 1) { const cl = c.cloneNode(false); walk(c).forEach((x) => cl.appendChild(x)); out.push(cl); }
      });
      return out;
    };
    const nodes = walk(tmp);
    el.innerHTML = ""; nodes.forEach((x) => el.appendChild(x));
    el.setAttribute("aria-label", tmp.textContent.replace(/\s+/g, " ").trim());
  }

  /* ---------------- Language apply ---------------- */
  function applyLang(first) {
    root.lang = lang;
    $$("[data-es]").forEach((el) => {
      if (el.dataset.en == null) el.dataset.en = el.innerHTML;
      const html = lang === "es" ? el.dataset.es : el.dataset.en;
      if (el.hasAttribute("data-split")) { el.dataset.src = html; split(el); }
      else el.innerHTML = html;
    });
    $$("[data-es-ph]").forEach((el) => { if (el.dataset.enPh == null) el.dataset.enPh = el.placeholder; el.placeholder = lang === "es" ? el.dataset.esPh : el.dataset.enPh; });
    $$("[data-es-label]").forEach((el) => { if (el.dataset.enLabel == null) el.dataset.enLabel = el.getAttribute("aria-label"); el.setAttribute("aria-label", lang === "es" ? el.dataset.esLabel : el.dataset.enLabel); });
    if (d.body.dataset.titleEs) { if (!d.body.dataset.titleEn) d.body.dataset.titleEn = d.title; d.title = lang === "es" ? d.body.dataset.titleEs : d.body.dataset.titleEn; }
    $$("[data-split]:not([data-es])").forEach((el) => { if (first) split(el); });
    if (!first) $$("[data-split]").forEach((el) => { if (el.dataset.wasIn) el.classList.add("is-in"); });
  }
  function setLang(l) {
    if (l === lang) return;
    lang = l; try { localStorage.setItem("mrb-lang", l); } catch (e) {}
    $("#chrome-top").innerHTML = chromeTop();
    const f = $("#site-foot"); if (f) f.innerHTML = chromeFoot();
    applyLang(false);
    bindChrome(); renderCart(); clock();
    d.dispatchEvent(new CustomEvent("mrb:lang", { detail: lang }));
    observe();
    $$("[data-rv]").forEach((e) => { if (e.dataset.wasIn) e.classList.add("is-in"); });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  /* ---------------- Reveal observer ---------------- */
  let io;
  function observe() {
    if (!("IntersectionObserver" in window)) { $$("[data-split],[data-rv],.kf").forEach((e) => e.classList.add("is-in")); return; }
    io = io || new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("is-in"); en.target.dataset.wasIn = 1; io.unobserve(en.target); scramble(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    $$("[data-split]:not(.is-in),[data-rv]:not(.is-in),.kf:not(.is-in),[data-count],[data-scramble]").forEach((e) => io.observe(e));
  }

  /* ---------------- Scramble ---------------- */
  const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ";
  function scramble(el) {
    const targets = el.matches("[data-scramble]") ? [el] : $$("[data-scramble]", el);
    targets.forEach((t) => {
      if (reduced || t.dataset.done) return; t.dataset.done = 1;
      const final = t.textContent; let f = 0; const total = 26;
      (function step() {
        let s = "";
        for (let i = 0; i < final.length; i++) {
          const reveal = (f / total) * final.length;
          s += i < reveal || final[i] === " " ? final[i] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        t.textContent = s;
        if (f++ < total) requestAnimationFrame(step); else t.textContent = final;
      })();
    });
    if (el.matches("[data-count]")) count(el);
  }

  /* ---------------- Counters ---------------- */
  function count(el) {
    if (el.dataset.counted) return; el.dataset.counted = 1;
    const to = parseFloat(el.dataset.count), dec = (el.dataset.count.split(".")[1] || "").length;
    const dur = 1600, t0 = performance.now() + (parseInt(el.dataset.countDelay) || 0);
    (function f(now) {
      const p = Math.max(0, Math.min(1, (now - t0) / dur));
      const e = 1 - Math.pow(1 - p, 4);
      el.textContent = (to * e).toFixed(dec).replace(".", lang === "es" ? "," : ".");
      if (p < 1) requestAnimationFrame(f);
    })(performance.now());
  }

  /* ---------------- Clock ---------------- */
  function clock() {
    const set = () => { const s = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" }).format(new Date()); $$("[data-clock]").forEach((e) => (e.textContent = s)); };
    set(); clearInterval(clock.t); clock.t = setInterval(set, 15000);
  }

  /* ---------------- Menu ---------------- */
  function toggleMenu(force) {
    const open = force != null ? force : !root.classList.contains("menu-open");
    root.classList.toggle("menu-open", open);
    const b = $("[data-menu]"); if (b) b.setAttribute("aria-expanded", open);
    $("#menu").setAttribute("aria-hidden", !open);
    if (window.__lenis) open ? __lenis.stop() : __lenis.start();
  }

  /* ---------------- Magnetic ---------------- */
  function magnetic() {
    if (!fine) return;
    $$("[data-magnetic]").forEach((el) => {
      if (el.dataset.mg) return; el.dataset.mg = 1;
      const target = el.matches(".btn") ? el : $(".btn", el) || el;
      el.addEventListener("mousemove", (e) => { const r = target.getBoundingClientRect(); target.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px,${(e.clientY - r.top - r.height / 2) * 0.32}px)`; });
      el.addEventListener("mouseleave", () => (target.style.transform = ""));
    });
  }

  /* ---------------- Cursor ---------------- */
  function cursor() {
    if (!fine || reduced) return;
    const c = $(".cursor"); if (!c) return;
    const dot = $(".cursor__dot", c), ring = $(".cursor__ring", c), lab = $(".cursor__lab", c);
    let x = innerWidth / 2, y = innerHeight / 2, rx = x, ry = y;
    if (!cursor.bound) {
      cursor.bound = 1;
      addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; cursor.pos = [x, y]; });
      d.addEventListener("mouseover", (e) => {
        const cc = $(".cursor"); if (!cc) return;
        const t = e.target.closest("[data-cursor]");
        cc.classList.toggle("has-lab", !!t); if (t) $(".cursor__lab", cc).textContent = t.dataset.cursor;
        cc.classList.toggle("is-hover", !t && !!e.target.closest("a,button,summary,input,select,textarea"));
      });
    }
    if (cursor.pos) { x = rx = cursor.pos[0]; y = ry = cursor.pos[1]; }
    cancelAnimationFrame(cursor.raf);
    (function loop() {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      dot.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      lab.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      cursor.raf = requestAnimationFrame(loop);
    })();
  }

  /* ---------------- Nav on scroll ---------------- */
  let lastY = 0;
  function onScroll(y) {
    const nav = $("#nav"); if (!nav) return;
    nav.classList.toggle("is-scrolled", y > 40);
    if (!root.classList.contains("menu-open")) nav.classList.toggle("is-hidden", y > lastY + 4 && y > 400);
    if (y < lastY - 4) nav.classList.remove("is-hidden");
    lastY = y;
  }

  /* ---------------- Smooth scroll ---------------- */
  function smooth() {
    if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
    if (reduced || !window.Lenis) { addEventListener("scroll", () => onScroll(scrollY), { passive: true }); return; }
    const lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, touchMultiplier: 1.4 });
    window.__lenis = lenis;
    lenis.on("scroll", (e) => { onScroll(e.scroll); if (window.ScrollTrigger) ScrollTrigger.update(); });
    if (window.gsap) { gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    d.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const id = a.getAttribute("href"); if (id.length < 2) return;
      const t = $(id); if (!t) return; e.preventDefault(); lenis.scrollTo(t, { offset: -20 });
    });
    if (location.hash && $(location.hash)) setTimeout(() => lenis.scrollTo($(location.hash), { immediate: true, offset: -20 }), 200);
  }

  /* ---------------- Rotating words ---------------- */
  function rotators() {
    $$("[data-rot]").forEach((r) => {
      clearInterval(r._t);
      const items = $$(".rot__i", r); let i = 0;
      items.forEach((x, k) => { x.classList.toggle("is-on", k === 0); x.classList.remove("is-out"); });
      r._t = setInterval(() => {
        const cur = items[i]; i = (i + 1) % items.length; const nx = items[i];
        cur.classList.remove("is-on"); cur.classList.add("is-out");
        nx.classList.remove("is-out"); nx.classList.add("is-on");
        setTimeout(() => cur.classList.remove("is-out"), 850);
      }, 2000);
    });
  }

  /* ---------------- Starfield (warp) ---------------- */
  function starfield() {
    const cv = $("canvas.sf"); if (!cv) return;
    const ctx = cv.getContext("2d"); let w, h, stars = [], speed = 0.6, boost = 0;
    const N = innerWidth < 700 ? 140 : 320;
    const resize = () => { const dpr = Math.min(devicePixelRatio, 2); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; };
    resize(); addEventListener("resize", resize);
    for (let i = 0; i < N; i++) stars.push({ x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z: Math.random() });
    let lastS = scrollY;
    (function loop() {
      const s = window.__lenis ? __lenis.scroll : scrollY; const v = Math.abs(s - lastS); lastS = s;
      boost += (Math.min(v, 80) / 6 - boost) * 0.08;
      const sp = (speed + boost) * 0.004;
      ctx.clearRect(0, 0, w, h);
      for (const st of stars) {
        const pz = st.z; st.z -= sp; if (st.z <= 0.02) { st.z = 1; st.x = (Math.random() - 0.5) * 2; st.y = (Math.random() - 0.5) * 2; continue; }
        const sx = (st.x / st.z) * w * 0.5 + w / 2, sy = (st.y / st.z) * h * 0.5 + h / 2;
        const px = (st.x / pz) * w * 0.5 + w / 2, py = (st.y / pz) * h * 0.5 + h / 2;
        const a = Math.min(1, (1 - st.z) * 1.4);
        ctx.strokeStyle = `rgba(${150 + 80 * (1 - st.z) | 0},${210 + 30 * (1 - st.z) | 0},255,${a})`;
        ctx.lineWidth = (1 - st.z) * 2.2;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
      }
      if (!reduced) requestAnimationFrame(loop);
    })();
  }

  /* ---------------- Card tilt & shine ---------------- */
  function tilt(scope = d) {
    if (!fine || reduced) return;
    $$(".pcard", scope).forEach((c) => {
      if (c.dataset.tilt) return; c.dataset.tilt = 1;
      c.addEventListener("mousemove", (e) => {
        const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        c.style.setProperty("--mx", px * 100 + "%"); c.style.setProperty("--my", py * 100 + "%");
        c.style.transform = `perspective(900px) rotateY(${(px - 0.5) * 7}deg) rotateX(${(0.5 - py) * 7}deg) translateY(-4px)`;
      });
      c.addEventListener("mouseleave", () => (c.style.transform = ""));
    });
  }

  /* ---------------- Product card HTML ---------------- */
  function cardHTML(p) {
    return `<article class="pcard" data-id="${p.id}" data-cat="${p.cat}" data-cursor="${T("View", "Ver")}">
      <button class="pcard__media" type="button" data-qv="${p.id}" aria-label="${T("Quick view", "Vista rápida")}: ${p.name}">
        <img src="${IMG}${p.img[0]}-sm.webp" srcset="${IMG}${p.img[0]}-sm.webp 480w, ${IMG}${p.img[0]}.webp 1080w" sizes="(min-width:1000px) 30vw, 80vw" alt="MRB ${p.name}" loading="lazy" width="480" height="600">
        <img src="${IMG}${p.img[1]}-sm.webp" alt="" loading="lazy" width="480" height="600">
        <span class="pcard__badge t-nano">${tr(p.badge)}</span><span class="pcard__no t-nano tnum">${p.no}/06</span>
      </button>
      <span class="pcard__shine"></span>
      <div class="pcard__body">
        <span class="pcard__cat t-nano">${tr(p.catLabel)}</span>
        <h3 class="pcard__name">${p.name}</h3>
        <p class="pcard__desc">${tr(p.short)}</p>
        <div class="pcard__foot">
          <p class="price tnum">${eur(p.price)}<small>${T("or", "o")} 12× ${eur(Math.round((p.price / 12) * 100) / 100)} · 0%</small></p>
          <button class="add" type="button" data-add="${p.id}"><span>${T("Add", "Añadir")}</span><i aria-hidden="true">+</i></button>
        </div>
      </div>
    </article>`;
  }

  /* ---------------- Cart ---------------- */
  const FREE = 500;
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem("mrb-cart") || "[]").filter((c) => PRODUCTS.find((p) => p.id === c.id)); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem("mrb-cart", JSON.stringify(cart)); } catch (e) {} };
  const prod = (id) => PRODUCTS.find((p) => p.id === id);
  const gross = () => cart.reduce((s, c) => s + prod(c.id).price * c.qty, 0);
  const BUNDLE = ["horizon-x", "aura-one", "neural-core"];
  const discount = () => (BUNDLE.every((id) => cart.some((c) => c.id === id)) ? Math.round(BUNDLE.reduce((s, id) => s + prod(id).price, 0) * 0.1) : 0);
  const subtotal = () => gross() - discount();
  const qtyTotal = () => cart.reduce((s, c) => s + c.qty, 0);

  function add(id, color, from) {
    const p = prod(id); if (!p) return;
    color = color || p.colors[0][0];
    const ex = cart.find((c) => c.id === id && c.color === color);
    ex ? ex.qty++ : cart.push({ id, color, qty: 1 });
    save(); renderCart();
    const cc = $("[data-cart-count]"); if (cc) { cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump"); }
    flyTo(p, from);
    toast(`<img src="${IMG}${p.img[0]}-sm.webp" alt=""><span><b>${p.name}</b> ${T("added to your bag", "añadido al carrito")}</span>`);
  }
  function flyTo(p, from) {
    if (!from || reduced) return;
    const tgt = $("[data-cart-open]"); if (!tgt) return;
    const a = from.getBoundingClientRect(), b = tgt.getBoundingClientRect();
    const im = d.createElement("img"); im.className = "fly"; im.src = IMG + p.img[0] + "-sm.webp";
    im.style.left = a.left + a.width / 2 - 30 + "px"; im.style.top = a.top + a.height / 2 - 30 + "px";
    d.body.appendChild(im);
    const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    im.animate([{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${dx * 0.5}px,${dy - 120}px) scale(.8)`, opacity: 1, offset: 0.5 }, { transform: `translate(${dx}px,${dy}px) scale(.2)`, opacity: 0.2 }], { duration: 900, easing: "cubic-bezier(.5,0,.2,1)" }).onfinish = () => im.remove();
  }
  function setQty(i, q) { if (q <= 0) cart.splice(i, 1); else cart[i].qty = Math.min(9, q); save(); renderCart(); }

  function renderCart() {
    const n = qtyTotal();
    $$("[data-cart-count]").forEach((e) => { e.textContent = n; e.classList.toggle("has", n > 0); });
    const body = $("[data-cart-body]"), foot = $("[data-cart-foot]"); if (!body) return;
    $("[data-cart-n]").textContent = n ? `(${n})` : "";
    if (!cart.length) {
      body.innerHTML = `<div class="empty">${ICON.bag}<p>${T("Your bag is empty. The future is not going to buy itself.", "Tu carrito está vacío. El futuro no se va a comprar solo.")}</p>${btn("btn--primary btn--sm", "shop.html", T("Explore the drop", "Ver la colección"))}</div>`;
      foot.innerHTML = ""; return;
    }
    body.innerHTML = cart.map((c, i) => { const p = prod(c.id); const col = p.colors.find((x) => x[0] === c.color) || p.colors[0];
      return `<div class="citem"><img src="${IMG}${p.img[0]}-sm.webp" alt="${p.name}">
        <div><b>${p.name}</b><span class="meta">${tr(p.catLabel)} · ${T(col[0], col[1])}</span><br>
        <span class="qty"><button type="button" data-q="${i}" data-d="-1" aria-label="−">−</button><span class="tnum">${c.qty}</span><button type="button" data-q="${i}" data-d="1" aria-label="+">+</button></span></div>
        <div class="citem__r"><b class="tnum">${eur(p.price * c.qty)}</b><button class="citem__rm" type="button" data-rm="${i}">${T("Remove", "Quitar")}</button></div></div>`; }).join("");
    const st = subtotal(), left = Math.max(0, FREE - st);
    foot.innerHTML = `
      <div class="ship-bar"><span>${left ? T(`You are ${eur(left)} away from free express delivery`, `Te faltan ${eur(left)} para el envío exprés gratis`) : T("Free express delivery unlocked · 48 h", "Envío exprés gratis desbloqueado · 48 h")}</span><i style="--p:${Math.min(1, st / FREE)}"></i></div>
      <div class="sumrow"><span>${T("Subtotal", "Subtotal")}</span><span class="tnum">${eur(gross())}</span></div>
      ${discount() ? `<div class="sumrow" style="color:var(--cyan)"><span>${T("Creator bundle −10%", "Pack creador −10 %")}</span><span class="tnum">−${eur(discount())}</span></div>` : ""}
      <div class="sumrow"><span>${T("Delivery", "Envío")}</span><span>${left ? eur(9.9) : T("Free", "Gratis")}</span></div>
      <div class="sumrow total"><span>Total</span><span class="tnum">${eur(st + (left ? 9.9 : 0))}</span></div>
      <p class="note">${T("VAT included · or 12 payments of", "IVA incluido · o 12 pagos de")} ${eur(Math.round(((st + (left ? 9.9 : 0)) / 12) * 100) / 100)} ${T("at 0% APR", "al 0 % TAE")}</p>
      <button class="btn btn--primary btn--block" type="button" data-checkout><span class="roll"><span>${T("Checkout", "Finalizar compra")}</span><span aria-hidden="true">${T("Checkout", "Finalizar compra")}</span></span><span class="btn__ico">${ARROW}</span></button>`;
  }
  function openCart(o = true) {
    $("#cart").classList.toggle("is-on", o); $("#cart").setAttribute("aria-hidden", !o);
    $("[data-scrim]").classList.toggle("is-on", o || $("#modal").classList.contains("is-on"));
    if (window.__lenis) o ? __lenis.stop() : __lenis.start();
  }

  /* ---------------- Modal ---------------- */
  function openModal(html) {
    openCart(false);
    $("[data-modal-body]").innerHTML = html;
    const m = $("#modal"); m.classList.add("is-on"); m.setAttribute("aria-hidden", "false");
    $("[data-scrim]").classList.add("is-on");
    if (window.__lenis) __lenis.stop();
    setTimeout(() => { const f = $(".modal__card button, .modal__card input", m); f && f.focus({ preventScroll: true }); }, 50);
  }
  function closeModal() {
    const m = $("#modal"); m.classList.remove("is-on"); m.setAttribute("aria-hidden", "true");
    $("[data-scrim]").classList.remove("is-on");
    if (window.__lenis) __lenis.start();
  }

  function quickView(id) {
    const p = prod(id); if (!p) return;
    let color = p.colors[0][0];
    openModal(`<div class="qv">
      <div class="qv__media" data-cursor="${p.name}">
        ${p.img.map((im, i) => `<img src="${IMG}${im}.webp" alt="MRB ${p.name}" style="opacity:${i ? 0 : 1}" data-qi="${i}">`).join("")}
        <div class="qv__thumbs">${p.img.map((im, i) => `<button type="button" class="${i ? "" : "is-on"}" data-thumb="${i}" aria-label="${T("Image", "Imagen")} ${i + 1}"><img src="${IMG}${im}-sm.webp" alt=""></button>`).join("")}</div>
      </div>
      <div class="qv__body">
        <span class="label">${tr(p.catLabel)} · ${p.no}/06</span>
        <h2 class="f-display t-h2">${p.name}<span class="acc">.</span></h2>
        <p class="dim">${tr(p.long)}</p>
        <dl class="specs">${p.specs.map((s) => `<div><dt>${T(s[0], s[1])}</dt><dd>${s[2]}</dd></div>`).join("")}</dl>
        <div class="field"><span class="lab">${T("Finish", "Acabado")}: <b data-colname style="color:var(--ink)">${T(p.colors[0][0], p.colors[0][1])}</b></span>
          <div class="swatches">${p.colors.map((c, i) => `<button type="button" class="${i ? "" : "is-on"}" style="background:${c[2]}" data-col="${c[0]}" data-colt="${T(c[0], c[1])}" aria-label="${T(c[0], c[1])}"></button>`).join("")}</div></div>
        <div class="between"><p class="price tnum" style="font-size:30px">${eur(p.price)}<small>${T("VAT incl. · or", "IVA incl. · o")} 12× ${eur(Math.round((p.price / 12) * 100) / 100)} · 0%</small></p>
          <button class="add" type="button" data-add-qv="${p.id}"><span>${T("Add to bag", "Añadir al carrito")}</span><i>+</i></button></div>
        ${p.demo ? `<a class="link link--under" href="vr-demo.html#book">${T("Try it first: book a free 30-min demo", "Pruébalas antes: reserva una demo gratis de 30 min")} ${ARROW}</a>` : `<p class="note">${T("Free 48 h delivery over €500 · 30-day returns · 2-year MRB Care", "Envío gratis en 48 h desde 500 € · 30 días de devolución · 2 años de MRB Care")}</p>`}
      </div></div>`);
    const m = $("#modal");
    $$("[data-thumb]", m).forEach((b) => b.addEventListener("click", () => {
      $$("[data-thumb]", m).forEach((x) => x.classList.toggle("is-on", x === b));
      $$("[data-qi]", m).forEach((im) => (im.style.opacity = im.dataset.qi === b.dataset.thumb ? 1 : 0));
    }));
    $$("[data-col]", m).forEach((b) => b.addEventListener("click", () => {
      color = b.dataset.col; $$("[data-col]", m).forEach((x) => x.classList.toggle("is-on", x === b)); $("[data-colname]", m).textContent = b.dataset.colt;
    }));
    $("[data-add-qv]", m).addEventListener("click", (e) => { add(p.id, color, e.currentTarget); const b = e.currentTarget; b.classList.add("is-added"); setTimeout(() => b.classList.remove("is-added"), 1200); });
  }

  function checkout() {
    if (!cart.length) return;
    const st = subtotal(), ship = st >= FREE ? 0 : 9.9;
    openModal(`<div style="padding:clamp(24px,4vw,56px);display:grid;gap:26px">
      <div><span class="label">${T("Secure checkout · demo", "Pago seguro · demo")}</span><h2 class="f-display t-h2" style="margin-top:14px">${T("Almost yours", "Casi tuyo")}<span class="acc">.</span></h2></div>
      <form class="fgrid" data-co novalidate>
        <div class="field"><label for="co-n">${T("Full name", "Nombre completo")}</label><input class="input" id="co-n" required autocomplete="name"></div>
        <div class="field"><label for="co-e">Email</label><input class="input" id="co-e" type="email" required autocomplete="email"></div>
        <div class="field full"><label for="co-a">${T("Delivery address", "Dirección de entrega")}</label><input class="input" id="co-a" required autocomplete="street-address" placeholder="${T("Street, number, city", "Calle, número, ciudad")}"></div>
        <div class="field full"><span class="lab">${T("Delivery", "Entrega")}</span><div class="row">
          <button type="button" class="chip is-on" data-dl="home">${T("Express to your door · 48 h", "Exprés a domicilio · 48 h")}</button>
          <button type="button" class="chip" data-dl="store">${T("Pick up at MRB Lab Madrid · free", "Recogida en MRB Lab Madrid · gratis")}</button></div></div>
        <div class="full" style="display:grid;gap:10px;padding:18px;border-radius:16px;border:1px solid var(--line)">
          ${cart.map((c) => `<div class="sumrow"><span>${c.qty}× ${prod(c.id).name}</span><span class="tnum">${eur(prod(c.id).price * c.qty)}</span></div>`).join("")}
          ${discount() ? `<div class="sumrow" style="color:var(--cyan)"><span>${T("Creator bundle −10%", "Pack creador −10 %")}</span><span class="tnum">−${eur(discount())}</span></div>` : ""}
          <div class="sumrow"><span>${T("Delivery", "Envío")}</span><span data-shipv>${ship ? eur(ship) : T("Free", "Gratis")}</span></div>
          <div class="sumrow total"><span>Total</span><span class="tnum" data-tot>${eur(st + ship)}</span></div>
        </div>
        <label class="check full"><input type="checkbox" required> <span>${T("I understand MRB is a concept store built for a portfolio: no payment is taken and nothing is shipped.", "Entiendo que MRB es una tienda concepto creada para un portfolio: no se cobra nada ni se envía nada.")}</span></label>
        <div class="full"><button class="btn btn--primary btn--block" type="submit"><span class="roll"><span>${T("Place demo order", "Hacer pedido de prueba")}</span><span aria-hidden="true">${T("Place demo order", "Hacer pedido de prueba")}</span></span><span class="btn__ico">${ARROW}</span></button></div>
      </form></div>`);
    const m = $("#modal"), form = $("[data-co]", m);
    $$("[data-dl]", m).forEach((b) => b.addEventListener("click", () => {
      $$("[data-dl]", m).forEach((x) => x.classList.toggle("is-on", x === b));
      const s = b.dataset.dl === "store" ? 0 : ship;
      $("[data-shipv]", m).textContent = s ? eur(s) : T("Free", "Gratis"); $("[data-tot]", m).textContent = eur(st + s);
    }));
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("input[required]", form).forEach((i) => { const bad = i.type === "checkbox" ? !i.checked : i.type === "email" ? !/^\S+@\S+\.\S+$/.test(i.value) : !i.value.trim(); i.classList.toggle("is-err", bad); if (bad) ok = false; });
      if (!ok) { toast(T("Please complete the highlighted fields", "Completa los campos marcados")); return; }
      const code = "MRB-" + Math.random().toString(36).slice(2, 7).toUpperCase();
      const name = $("#co-n", m).value.split(" ")[0];
      cart = []; save(); renderCart();
      $("[data-modal-body]").innerHTML = `<div style="padding:clamp(30px,5vw,70px);display:grid;gap:22px;text-align:center;justify-items:center">
        <svg viewBox="0 0 80 80" width="90" height="90"><circle cx="40" cy="40" r="36" fill="none" stroke="url(#okg)" stroke-width="3"/><path d="M24 41l11 11 22-24" fill="none" stroke="#7fe8ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="stroke-dasharray:60;stroke-dashoffset:60;animation:draw 1s .2s var(--ease) forwards"/><defs><linearGradient id="okg"><stop stop-color="#7fe8ff"/><stop offset="1" stop-color="#2a5bff"/></linearGradient></defs></svg>
        <span class="label">${T("Order", "Pedido")} ${code}</span>
        <h2 class="f-display t-h2">${T("Welcome to the future", "Bienvenida al futuro")}, ${name.replace(/[<>&"]/g, "")}<span class="acc">.</span></h2>
        <p class="dim measure">${T("In a real store this is where your tracking link would arrive. Here, it is where the demo ends. Thanks for trying the MRB checkout.", "En una tienda real aquí te llegaría el enlace de seguimiento. Aquí es donde acaba la demo. Gracias por probar el checkout de MRB.")}</p>
        ${btn("btn--light", "vr-demo.html#book", T("Book a VR demo next", "Ahora reserva una demo VR"))}</div>
        <style>@keyframes draw{to{stroke-dashoffset:0}}</style>`;
    });
  }

  /* ---------------- Toast ---------------- */
  function toast(html) {
    const box = $(".toasts"); if (!box) return;
    const t = d.createElement("div"); t.className = "toast"; t.innerHTML = html; box.appendChild(t);
    setTimeout(() => t.remove(), 3300);
  }

  /* ---------------- Bind chrome ---------------- */
  function bindChrome() {
    $("[data-menu]").addEventListener("click", () => toggleMenu());
    $$(".menu a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));
    $$("[data-lang]").forEach((b) => b.addEventListener("click", () => setLang(b.dataset.lang)));
    $("[data-cart-open]").addEventListener("click", () => openCart(true));
    $("[data-cart-close]").addEventListener("click", () => openCart(false));
    $("[data-scrim]").addEventListener("click", () => { openCart(false); closeModal(); });
    $("[data-modal-close]").addEventListener("click", closeModal);
    $("[data-cart-body]").addEventListener("click", (e) => {
      const q = e.target.closest("[data-q]"); if (q) setQty(+q.dataset.q, cart[+q.dataset.q].qty + +q.dataset.d);
      const r = e.target.closest("[data-rm]"); if (r) setQty(+r.dataset.rm, 0);
    });
    $("[data-cart-foot]").addEventListener("click", (e) => { if (e.target.closest("[data-checkout]")) checkout(); });
    const nl = $("[data-newsletter]");
    if (nl) nl.addEventListener("submit", (e) => { e.preventDefault(); nl.reset(); toast(T("You are on the list. Early access incoming.", "Ya estás en la lista. Acceso anticipado en camino.")); });
    magnetic(); cursor();
  }

  /* global delegated product actions */
  d.addEventListener("click", (e) => {
    const a = e.target.closest("[data-add]");
    if (a) { e.preventDefault(); add(a.dataset.add, null, a); a.classList.add("is-added"); setTimeout(() => a.classList.remove("is-added"), 1200); return; }
    const q = e.target.closest("[data-qv]");
    if (q) { e.preventDefault(); quickView(q.dataset.qv); }
  });
  d.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeModal(); openCart(false); toggleMenu(false); } });

  /* ---------------- Cursor light trail ---------------- */
  function trail() {
    if (!fine || reduced) return;
    const cv = d.createElement("canvas"); cv.className = "trail"; cv.setAttribute("aria-hidden", "true"); d.body.appendChild(cv);
    const ctx = cv.getContext("2d"); let pts = [], w, h, dpr;
    const rs = () => { dpr = Math.min(devicePixelRatio, 2); w = cv.width = innerWidth * dpr; h = cv.height = innerHeight * dpr; };
    rs(); addEventListener("resize", rs);
    addEventListener("mousemove", (e) => pts.push({ x: e.clientX * dpr, y: e.clientY * dpr, t: performance.now() }));
    (function loop() {
      const now = performance.now(); pts = pts.filter((p) => now - p.t < 420);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round"; ctx.shadowColor = "#3d8bff"; ctx.shadowBlur = 16 * dpr;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], k = 1 - (now - b.t) / 420;
        ctx.strokeStyle = `rgba(127,232,255,${k * 0.75})`; ctx.lineWidth = k * 4.5 * dpr;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      requestAnimationFrame(loop);
    })();
  }
  /* ---------------- Glitch words on hover ---------------- */
  function glitchWords() {
    d.addEventListener("mouseover", (e) => {
      const w = e.target.closest(".hero__title .wi, .phead__title .wi, .closing__title .wi, .depth__title .wi"); if (!w || w.classList.contains("glitch")) return;
      w.classList.add("glitch"); w.addEventListener("animationend", () => w.classList.remove("glitch"), { once: true });
    });
  }

  /* ---------------- Public API ---------------- */
  window.MRB = { $, $$, tr, T: (en, es) => T(en, es), get lang() { return lang; }, eur: (n) => eur(n), cardHTML: (p) => cardHTML(p), tilt, split, observe, toast: (h) => toast(h), add, quickView, openModal, closeModal, btn, ARROW, reduced, fine, IMG, products: PRODUCTS, magnetic, logoSVG };

  /* ---------------- Boot ---------------- */
  root.classList.add("js");
  const top = d.createElement("div"); top.id = "chrome-top"; top.innerHTML = chromeTop(); d.body.prepend(top);
  const f = $("#site-foot"); if (f) { f.classList.add("foot"); f.innerHTML = chromeFoot(); }
  applyLang(true);
  bindChrome(); renderCart(); clock(); smooth(); starfield(); rotators();
  d.dispatchEvent(new CustomEvent("mrb:ready"));
  d.addEventListener("mrb:open", () => { observe(); tilt(); magnetic(); if (window.ScrollTrigger) ScrollTrigger.refresh(); }, { once: true });
  intro();
  trail(); glitchWords();
  d.addEventListener("mrb:lang", () => rotators());
})();
