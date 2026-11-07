/* MRB — shared scroll scenes + shop, VR demo booking and contact logic */
(function () {
  "use strict";
  const d = document, M = window.MRB; if (!M) return;
  const { $, $$ } = M;
  const page = d.body.dataset.page;
  const hasGS = !!(window.gsap && window.ScrollTrigger) && !M.reduced;
  if (hasGS) d.documentElement.classList.add("gs");
  const T = (en, es) => M.T(en, es);
  const ARROW = M.ARROW;

  /* =========== Shared scenes =========== */
  function depthScenes() {
    $$("[data-depth]").forEach((sec) => {
      const media = $(".depth__media", sec), img = $("img", media), strips = $$(".depth__strips i", sec), title = $(".depth__title", sec), n = $("[data-depth-n]", sec), hud = $(".depth__hud", sec);
      if (!hasGS) { title.classList.add("is-in"); return; }
      gsap.set(media, { clipPath: "inset(20% 26% 20% 26% round 30px)" });
      gsap.set(img, { scale: 1.45 });
      strips.forEach((s) => s.style.setProperty("--s", 1));
      gsap.set(title, { scale: 0.7, opacity: 0 });
      gsap.set(hud, { opacity: 0, scale: 1.2 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: sec, start: "top top", end: "bottom bottom", scrub: 0.6,
        onUpdate: (s) => { n.textContent = String(Math.round(s.progress * 100)).padStart(3, "0"); },
        onEnter: () => title.classList.add("is-in") } });
      tl.to(strips, { "--s": 0, duration: 0.35, stagger: { each: 0.025, from: "center" }, ease: "power2.inOut" }, 0)
        .to(media, { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 0.6, ease: "power2.inOut" }, 0.1)
        .to(img, { scale: 1, duration: 0.9, ease: "none" }, 0)
        .to(title, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.25)
        .to(hud, { opacity: 1, scale: 1, duration: 0.3 }, 0.35)
        .to(title, { scale: 1.6, opacity: 0, filter: "blur(12px)", duration: 0.3, ease: "power2.in" }, 0.78)
        .to(hud, { opacity: 0, duration: 0.2 }, 0.8);
    });
  }
  function parallax() {
    if (!hasGS) return;
    $$("[data-parallax]").forEach((img) => {
      gsap.fromTo(img, { yPercent: -7, scale: 1.16 }, { yPercent: 7, scale: 1.16, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }
  depthScenes(); parallax();
  d.addEventListener("mrb:lang", () => $$(".depth__title").forEach((x) => x.classList.add("is-in")));

  /* =========== SHOP =========== */
  if (page === "shop") {
    const P = M.products;
    const CATS = [["all", "All", "Todo"], ["vr", "VR & MR", "VR y RM"], ["audio", "Audio", "Audio"], ["wear", "Wearables", "Wearables"], ["drone", "Drones", "Drones"], ["ai", "AI hardware", "Hardware IA"]];
    let cat = new URLSearchParams(location.search).get("c") || "all"; if (!CATS.find((c) => c[0] === cat)) cat = "all";
    let sort = "featured";
    const grid = $("[data-grid]"), fl = $("[data-filters]");

    const renderFilters = () => {
      fl.innerHTML = CATS.map((c) => { const n = c[0] === "all" ? P.length : P.filter((p) => p.cat === c[0]).length;
        return `<button type="button" class="chip" data-cat="${c[0]}" aria-pressed="${c[0] === cat}">${T(c[1], c[2])} <span class="t-nano" style="opacity:.6">${n}</span></button>`; }).join("");
    };
    const renderGrid = (animate) => {
      let list = P.slice();
      if (sort === "asc") list.sort((a, b) => a.price - b.price);
      if (sort === "desc") list.sort((a, b) => b.price - a.price);
      if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name));
      grid.innerHTML = list.map(M.cardHTML).join("");
      $$(".pcard", grid).forEach((c) => c.classList.toggle("is-hidden", cat !== "all" && c.dataset.cat !== cat));
      M.tilt(grid);
      const vis = $$(".pcard:not(.is-hidden)", grid);
      if (animate && window.gsap && !M.reduced) gsap.fromTo(vis, { opacity: 0, y: 40, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.07, ease: "expo.out", clearProps: "transform" });
      else if (window.gsap && !M.reduced) gsap.fromTo(vis, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1.1, stagger: 0.09, ease: "expo.out", delay: 0.3, clearProps: "transform" });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    };
    const renderCompare = () => {
      const rows = [
        [T("Category", "Categoría"), (p) => M.tr(p.catLabel)],
        [T("Price", "Precio"), (p) => `<b>${M.eur(p.price)}</b>`],
        [T("Headline spec", "Dato clave"), (p) => p.specs[0][2]],
        [T("Battery / power", "Batería / consumo"), (p) => (p.specs.find((s) => /Battery|Power|Flight/.test(s[0])) || ["", "", "—"])[2]],
        [T("Weight", "Peso"), (p) => (p.specs.find((s) => s[0] === "Weight") || ["", "", "—"])[2]],
        [T("Try in store", "Pruébalo en tienda"), (p) => (p.demo ? `<a class="link" style="color:var(--cyan)" href="vr-demo.html#book">${T("Book demo ↗", "Reservar demo ↗")}</a>` : T("Floor 0", "Planta 0"))],
        ["", (p) => `<button class="add" type="button" data-add="${p.id}" style="height:40px"><span>${T("Add", "Añadir")}</span><i>+</i></button>`]
      ];
      $("[data-compare]").innerHTML = `<thead><tr><th></th>${P.map((p) => `<th>${p.name}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr><td>${r[0]}</td>${P.map((p) => `<td>${r[1](p)}</td>`).join("")}</tr>`).join("")}</tbody>`;
    };
    fl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]"); if (!b) return; cat = b.dataset.cat;
      $$("[data-cat]", fl).forEach((x) => x.setAttribute("aria-pressed", x === b));
      history.replaceState(null, "", cat === "all" ? "shop.html" : "shop.html?c=" + cat);
      renderGrid(true);
    });
    $("[data-sort]").addEventListener("change", (e) => { sort = e.target.value; renderGrid(true); });
    $("[data-bundle]").addEventListener("click", (e) => { ["horizon-x", "aura-one", "neural-core"].forEach((id, i) => setTimeout(() => M.add(id, null, e.currentTarget), i * 160)); });
    renderFilters(); renderGrid(false); renderCompare();
    d.addEventListener("mrb:lang", () => { renderFilters(); renderGrid(true); renderCompare(); $("[data-bundle-price]").textContent = M.eur(2544); });
    $("[data-bundle-price]").textContent = M.eur(2544);
  }

  /* =========== VR DEMO BOOKING =========== */
  if (page === "demo") {
    const EXPS = [
      { id: "solo", name: ["Solo", "Solo"], dur: 30, price: 0, min: 1, max: 1, desc: ["One person, one world of your choice.", "Una persona, el mundo que elijas."], img: "vr-woman" },
      { id: "duo", name: ["Duo", "Dúo"], dur: 45, price: 0, min: 2, max: 4, desc: ["Bring your people. A shared multiplayer world.", "Trae a los tuyos. Un mundo multijugador compartido."], img: "vr-man" },
      { id: "creator", name: ["Creator", "Creador"], dur: 60, price: 19, min: 1, max: 2, desc: ["Studio 1:1 with AI and file export. €19, credited if you buy.", "Estudio 1:1 con IA y exportación. 19 €, descontados si compras."], img: "holo" }
    ];
    const st = { exp: EXPS[0], date: null, time: null, guests: 1 };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const maxDate = new Date(today); maxDate.setDate(today.getDate() + 60);
    let view = new Date(today.getFullYear(), today.getMonth(), 1);
    const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
    const iso = (dt) => `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
    const loc = () => (M.lang === "es" ? "es-ES" : "en-GB");
    const fmtDate = (dt, o = { weekday: "short", day: "numeric", month: "short" }) => new Intl.DateTimeFormat(loc(), o).format(dt);
    const isFull = (dt) => hash(iso(dt)) % 9 === 0;

    function renderExps() {
      $("[data-exps]").innerHTML = EXPS.map((x) => `<button type="button" class="exp ${x === st.exp ? "is-on" : ""}" data-exp="${x.id}" aria-pressed="${x === st.exp}">
        <em>${x.dur} min · ${x.price ? M.eur(x.price) : T("Free", "Gratis")}</em><b>${T(x.name[0], x.name[1])}</b><span>${T(x.desc[0], x.desc[1])}</span></button>`).join("");
    }
    function renderCal() {
      const y = view.getFullYear(), m = view.getMonth();
      const ttl = new Intl.DateTimeFormat(loc(), { month: "long", year: "numeric" }).format(view); $("[data-cal-title]").textContent = ttl.charAt(0).toUpperCase() + ttl.slice(1);
      const dows = M.lang === "es" ? ["L", "M", "X", "J", "V", "S", "D"] : ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
      let html = dows.map((x) => `<span class="dow">${x}</span>`).join("");
      const first = (new Date(y, m, 1).getDay() + 6) % 7, days = new Date(y, m + 1, 0).getDate();
      for (let i = 0; i < first; i++) html += "<span></span>";
      for (let dd = 1; dd <= days; dd++) {
        const dt = new Date(y, m, dd);
        const dis = dt < today || dt > maxDate || dt.getDay() === 0 || isFull(dt);
        const on = st.date && iso(st.date) === iso(dt);
        html += `<button type="button" ${dis ? "disabled" : ""} class="${on ? "is-on" : ""} ${iso(dt) === iso(today) ? "today" : ""}" data-day="${iso(dt)}" aria-label="${fmtDate(dt, { weekday: "long", day: "numeric", month: "long" })}${isFull(dt) && dt >= today && dt.getDay() ? " · full" : ""}">${dd}</button>`;
      }
      $("[data-cal]").innerHTML = html;
      $("[data-cal-prev]").disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      $("[data-cal-next]").disabled = new Date(y, m + 1, 1) > maxDate;
    }
    function slotsFor(dt) {
      const step = st.exp.dur === 30 ? 30 : 60, out = [];
      const end = dt.getDay() === 6 ? 19 * 60 : 20 * 60;
      for (let t = 10 * 60; t <= end; t += step) out.push(t);
      return out;
    }
    function renderTimes() {
      const box = $("[data-times]");
      if (!st.date) { box.innerHTML = `<p class="note">${T("Pick a day first.", "Elige primero un día.")}</p>`; return; }
      const now = new Date(), isToday = iso(st.date) === iso(now);
      box.innerHTML = slotsFor(st.date).map((t) => {
        const lab = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
        const h = hash(iso(st.date) + lab + st.exp.id);
        const past = isToday && t <= now.getHours() * 60 + now.getMinutes() + 30;
        const dis = past || h % 4 === 0;
        return `<button type="button" data-time="${lab}" ${dis ? "disabled" : ""} class="${st.time === lab ? "is-on" : ""}">${lab}${!dis && h % 5 === 0 ? `<span class="few">${T("1 left", "Queda 1")}</span>` : ""}</button>`;
      }).join("");
      if (!$("[data-time]:not(:disabled)", box)) box.innerHTML = `<p class="note">${T("No slots left this day. Try another one.", "No quedan horas este día. Prueba otro.")}</p>`;
    }
    function renderGuests() {
      st.guests = Math.max(st.exp.min, Math.min(st.exp.max, st.guests));
      $("[data-guests]").textContent = st.guests;
      $("[data-guest-note]").textContent = st.exp.min === st.exp.max ? T("Solo sessions are for one person.", "Las sesiones Solo son para una persona.") : T(`${st.exp.min} to ${st.exp.max} people for ${st.exp.name[0]}.`, `De ${st.exp.min} a ${st.exp.max} personas en ${st.exp.name[1]}.`);
    }
    const form = $("[data-book-form]");
    const formOk = () => { const n = $("#b-n").value.trim(), e = $("#b-e").value.trim(), c = form.ok.checked; return { n: !!n, e: /^\S+@\S+\.\S+$/.test(e), c }; };
    function renderSummary() {
      const x = st.exp;
      $("[data-sum-img]").src = M.IMG + x.img + ".webp";
      const rows = [
        [T("Experience", "Experiencia"), `${T(x.name[0], x.name[1])} · ${x.dur} min`],
        [T("Day", "Día"), st.date ? fmtDate(st.date, { weekday: "long", day: "numeric", month: "long" }) : "—"],
        [T("Time", "Hora"), st.time || "—"],
        [T("Guests", "Personas"), st.guests],
        [T("Where", "Dónde"), "MRB Lab · Fuencarral 120"],
        [T("Price", "Precio"), x.price ? M.eur(x.price * st.guests) : T("Free", "Gratis")]
      ];
      $("[data-summary]").innerHTML = rows.map((r) => `<div><dt>${r[0]}</dt><dd>${r[1]}</dd></div>`).join("");
      const f = formOk(), miss = [];
      if (!st.date) miss.push(T("a day", "un día")); if (!st.time) miss.push(T("a time", "una hora"));
      if (!f.n) miss.push(T("your name", "tu nombre")); if (!f.e) miss.push(T("a valid email", "un email válido")); if (!f.c) miss.push(T("the checkbox", "la casilla"));
      $("[data-book-confirm]").disabled = miss.length > 0;
      $("[data-book-missing]").textContent = miss.length ? T("Still missing: ", "Falta: ") + miss.join(", ") + "." : T("All set. One click and you are in.", "Todo listo. Un clic y estás dentro.");
    }
    const all = () => { renderExps(); renderCal(); renderTimes(); renderGuests(); renderSummary(); };

    $("[data-exps]").addEventListener("click", (e) => { const b = e.target.closest("[data-exp]"); if (!b) return; st.exp = EXPS.find((x) => x.id === b.dataset.exp); st.time = null; renderExps(); renderTimes(); renderGuests(); renderSummary(); });
    $("[data-cal]").addEventListener("click", (e) => { const b = e.target.closest("[data-day]"); if (!b || b.disabled) return; const [y, m, dd] = b.dataset.day.split("-").map(Number); st.date = new Date(y, m - 1, dd); st.time = null; renderCal(); renderTimes(); renderSummary();
      if (window.gsap && !M.reduced) gsap.from("[data-time]", { opacity: 0, y: 10, stagger: 0.02, duration: 0.4 }); });
    $("[data-cal-prev]").addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); renderCal(); });
    $("[data-cal-next]").addEventListener("click", () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); renderCal(); });
    $("[data-times]").addEventListener("click", (e) => { const b = e.target.closest("[data-time]"); if (!b || b.disabled) return; st.time = b.dataset.time; renderTimes(); renderSummary(); });
    $$("[data-g]").forEach((b) => b.addEventListener("click", () => { st.guests += +b.dataset.g; renderGuests(); renderSummary(); }));
    form.addEventListener("input", renderSummary); form.addEventListener("change", renderSummary);
    form.addEventListener("submit", (e) => e.preventDefault());

    /* pseudo-QR from booking code */
    function qr(code) {
      const N = 25, cells = []; let h = hash(code);
      const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
      const finder = (x, y) => [[0, 0], [N - 7, 0], [0, N - 7]].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
      const fcell = (x, y) => { for (const [fx, fy] of [[0, 0], [N - 7, 0], [0, N - 7]]) { const dx = x - fx, dy = y - fy; if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) return dx === 0 || dy === 0 || dx === 6 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4); } return false; };
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const on = finder(x, y) ? fcell(x, y) : rnd() > 0.52; if (on) cells.push(`<rect x="${x}" y="${y}" width="1" height="1"/>`); }
      return `<svg class="qr" viewBox="0 0 ${N} ${N}" shape-rendering="crispEdges" aria-label="Booking code ${code}"><g fill="#02040b">${cells.join("")}</g></svg>`;
    }
    function ics(b) {
      const [hh, mm] = b.time.split(":").map(Number), [y, m, dd] = b.date.split("-").map(Number);
      const pad = (n) => String(n).padStart(2, "0");
      const start = `${y}${pad(m)}${pad(dd)}T${pad(hh)}${pad(mm)}00`;
      const endMin = hh * 60 + mm + b.dur, end = `${y}${pad(m)}${pad(dd)}T${pad(Math.floor(endMin / 60))}${pad(endMin % 60)}00`;
      const txt = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//MRB//VR Demo//EN", "BEGIN:VEVENT", `UID:${b.code}@mrb.store`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`, `DTSTART;TZID=Europe/Madrid:${start}`, `DTEND;TZID=Europe/Madrid:${end}`, `SUMMARY:MRB Horizon X demo · ${b.exp}`, "LOCATION:MRB Lab\\, Calle de Fuencarral 120\\, 28010 Madrid", `DESCRIPTION:Booking ${b.code}. Arrive 5 minutes early.`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
      const a = d.createElement("a"); a.href = URL.createObjectURL(new Blob([txt], { type: "text/calendar" })); a.download = `MRB-demo-${b.code}.ics`; d.body.appendChild(a); a.click(); a.remove();
    }
    function showTicket(b) {
      const box = $("[data-ticket]"), dt = new Date(b.date + "T00:00:00");
      $("[data-book]").hidden = true; box.hidden = false;
      box.innerHTML = `<div class="stack" style="--s:28px">
        <p class="label"><span>${T("Booking confirmed", "Reserva confirmada")}</span></p>
        <div class="ticket">
          <div class="ticket__main">
            <img src="${M.IMG}logo.svg" alt="MRB" style="width:110px">
            <h3>${T("See you inside,", "Nos vemos dentro,")}<br><span class="acc">${b.name.replace(/[<>&"]/g, "")}.</span></h3>
            <dl class="ticket__grid">
              <div><dt>${T("Experience", "Experiencia")}</dt><dd>${b.exp} · ${b.dur} min</dd></div>
              <div><dt>${T("Day", "Día")}</dt><dd>${fmtDate(dt)}</dd></div>
              <div><dt>${T("Time", "Hora")}</dt><dd>${b.time}</dd></div>
              <div><dt>${T("Guests", "Personas")}</dt><dd>${b.guests}</dd></div>
              <div><dt>${T("Where", "Dónde")}</dt><dd>Fuencarral 120 · ${T("Floor 1", "Planta 1")}</dd></div>
              <div><dt>${T("Code", "Código")}</dt><dd class="tnum">${b.code}</dd></div>
            </dl>
          </div>
          <div class="ticket__side">${qr(b.code)}<span class="t-nano dim">${T("Show at the door", "Enséñalo en la puerta")}</span></div>
        </div>
        <div class="row">
          <button class="btn btn--primary" type="button" data-ics><span class="roll"><span>${T("Add to calendar", "Añadir al calendario")}</span><span aria-hidden="true">${T("Add to calendar", "Añadir al calendario")}</span></span><span class="btn__ico">${ARROW}</span></button>
          <button class="btn btn--ghost" type="button" data-again><span class="roll"><span>${T("Book another", "Reservar otra")}</span><span aria-hidden="true">${T("Book another", "Reservar otra")}</span></span><span class="btn__ico">${ARROW}</span></button>
          <button class="add" type="button" data-qv="horizon-x"><span>${T("Meet Horizon X", "Conoce Horizon X")}</span><i>+</i></button>
        </div>
        <p class="note">${T("Concept booking: nothing is sent and no slot is held. Your ticket stays saved in this browser.", "Reserva de prueba: no se envía nada ni se bloquea ninguna hora. Tu entrada queda guardada en este navegador.")}</p></div>`;
      $("[data-ics]", box).addEventListener("click", () => ics(b));
      $("[data-again]", box).addEventListener("click", () => { box.hidden = true; $("[data-book]").hidden = false; st.time = null; renderTimes(); renderSummary(); if (window.ScrollTrigger) ScrollTrigger.refresh(); });
      if (window.gsap && !M.reduced) gsap.from($(".ticket", box), { rotateX: -70, y: 80, opacity: 0, duration: 1.2, ease: "expo.out", transformPerspective: 900, transformOrigin: "50% 0%" });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }
    function myBooking() {
      const box = $("[data-mybooking]"); let b = null;
      try { b = JSON.parse(localStorage.getItem("mrb-booking") || "null"); } catch (e) {}
      if (!b || new Date(b.date + "T23:59:59") < new Date()) { box.innerHTML = ""; return; }
      box.innerHTML = `<button type="button" class="concept" data-show-ticket style="cursor:pointer">${T("You have a demo on", "Tienes una demo el")} ${fmtDate(new Date(b.date + "T00:00:00"))} · ${b.time} — ${T("view ticket", "ver entrada")} ↓</button>`;
      $("[data-show-ticket]", box).addEventListener("click", () => { showTicket(b); const t = $("#book"); window.__lenis ? __lenis.scrollTo(t) : t.scrollIntoView({ behavior: "smooth" }); });
    }
    $("[data-book-confirm]").addEventListener("click", () => {
      const f = formOk(); if (!(f.n && f.e && f.c && st.date && st.time)) return;
      const b = { code: "HX-" + Math.random().toString(36).slice(2, 6).toUpperCase() + "-" + String(Date.now()).slice(-3), name: $("#b-n").value.trim().split(" ")[0], exp: T(st.exp.name[0], st.exp.name[1]), dur: st.exp.dur, date: iso(st.date), time: st.time, guests: st.guests };
      try { localStorage.setItem("mrb-booking", JSON.stringify(b)); } catch (e) {}
      showTicket(b); myBooking();
      const t = $("#book"); window.__lenis ? __lenis.scrollTo(t, { offset: -40 }) : t.scrollIntoView({ behavior: "smooth" });
      M.toast(T("Booking confirmed. See you in the future.", "Reserva confirmada. Nos vemos en el futuro."));
    });
    all(); myBooking();
    d.addEventListener("mrb:lang", () => { all(); myBooking(); });
  }

  /* =========== CONTACT =========== */
  if (page === "contact") {
    let topic = "Order";
    function hours() {
      const days = M.lang === "es" ? ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"] : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const hrs = ["10:00 – 21:00", "10:00 – 21:00", "10:00 – 21:00", "10:00 – 21:00", "10:00 – 21:00", "10:00 – 20:00", T("Closed", "Cerrado")];
      const wd = new Intl.DateTimeFormat("en-GB", { weekday: "long", timeZone: "Europe/Madrid" }).format(new Date());
      const ti = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(wd);
      $("[data-hours]").innerHTML = days.map((x, i) => `<div class="${i === ti ? "is-today" : ""}"><span>${x}${i === ti ? " · " + T("today", "hoy") : ""}</span><span class="tnum">${hrs[i]}</span></div>`).join("");
    }
    $("[data-topics]").addEventListener("click", (e) => { const b = e.target.closest("[data-topic]"); if (!b) return; topic = b.dataset.topic; $$("[data-topic]").forEach((x) => x.classList.toggle("is-on", x === b)); });
    const form = $("[data-contact]");
    form.addEventListener("submit", (e) => {
      e.preventDefault(); let ok = true;
      $$("[required]", form).forEach((i) => { const bad = i.type === "checkbox" ? !i.checked : i.type === "email" ? !/^\S+@\S+\.\S+$/.test(i.value) : !i.value.trim(); i.classList.toggle("is-err", bad); if (bad) ok = false; });
      if (!ok) { M.toast(T("Please complete the highlighted fields", "Completa los campos marcados")); return; }
      const name = $("#c-n").value.trim(), order = $("#c-o").value.trim();
      const subject = `[MRB · ${topic}] ${name}`;
      const body = `${$("#c-m").value.trim()}\n\n— ${name} (${$("#c-e").value.trim()})${order ? "\nOrder: " + order : ""}`;
      const href = `mailto:malurosbolea@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      form.hidden = true; const okBox = $("[data-contact-ok]"); okBox.hidden = false;
      okBox.innerHTML = `<div style="display:grid;gap:20px;justify-items:start;padding:10px 0">
        <span class="label">${T("Message ready", "Mensaje listo")}</span>
        <h2 class="f-display t-h2">${T("Thanks", "Gracias")}, ${name.split(" ")[0].replace(/[<>&"]/g, "")}<span class="acc">.</span></h2>
        <p class="dim">${T("Your message is ready to go. Open it in your email app and hit send; a human replies within 12 hours.", "Tu mensaje está listo. Ábrelo en tu app de correo y dale a enviar; una persona te responde en menos de 12 horas.")}</p>
        <a class="btn btn--primary" href="${href}"><span class="roll"><span>${T("Open in my email app", "Abrir en mi correo")}</span><span aria-hidden="true">${T("Open in my email app", "Abrir en mi correo")}</span></span><span class="btn__ico">${ARROW}</span></a>
        <button class="link link--under" type="button" data-reset>${T("Write another message", "Escribir otro mensaje")}</button></div>`;
      $("[data-reset]", okBox).addEventListener("click", () => { okBox.hidden = true; form.hidden = false; form.reset(); });
    });
    hours(); d.addEventListener("mrb:lang", hours);
  }
})();
