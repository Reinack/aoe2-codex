/* GameKit — íconos y hover de unidades, tecnologías, edificios y civs para TODA la app.
 *
 * Tres formas de usarlo, de más manual a más automática (no hace falta volver a programar nada por vista):
 *
 *  1) Desde JS (plantillas):   GK.ico("paladin")  GK.emb("franks")  GK.age("feudal")  GK.stat("hp")  GK.res("gold")
 *                              GK.iconize(html)   GK.civify(html)     — devuelven HTML con el hover ya conectado.
 *  2) Con atributos:           <div data-gk="i:paladin">…</div>   <span data-gk="c:franks">…</span>
 *                              i = unidad | tecnología | edificio (por id del árbol), c = civ (por slug).
 *  3) Automático:              <div data-gk-auto>…texto…</div>     — pone íconos + hover en los nombres que reconoce,
 *                              incluso en contenido que se renderiza después (MutationObserver).
 *                              data-gk-auto="civs" para nombres de civ, "all" para ambos. data-gk-skip excluye una zona.
 *
 * Datos: GET /api/icons (web/data/icons.json, scripts/build-icons.mjs). El hover sale de ahí: costos, stats, efecto
 * en español, dónde se produce y en qué civs está. Estilo: docs/GUIA-DE-ESTILO.md del tech tree (gamekit.css).
 */
(() => {
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const EMPTY = { items: {}, names: {}, civs: [], civInfo: {}, ages: {}, stats: {}, res: {}, totalCivs: 56 };
  let D = EMPTY;
  const treeImg = (p) => `/tree/${p}`;

  // ── Íconos (HTML) ─────────────────────────────────────────────────────────
  // cls puede llevar "no-gk" para un ícono decorativo sin hover.
  const hov = (type, id, cls) => (/\bno-gk\b/.test(cls || "") ? "" : ` data-gk="${type}:${esc(id)}"`);
  const ico = (id, cls = "") => {
    const it = D.items[id];
    return it ? `<img class="ico k-${it.k} ${esc(cls)}" src="${treeImg(it.i)}" alt=""${hov("i", id, cls)} loading="lazy">` : "";
  };
  const emb = (slug, cls = "") =>
    slug && D.civs.includes(slug) ? `<img class="emb ${esc(cls)}" src="/img/civs/${esc(slug)}.png" alt=""${hov("c", slug, cls)} loading="lazy">` : "";
  const age = (a) => (D.ages[a] ? `<img class="age-ico" src="${treeImg(D.ages[a])}" alt="" title="${esc(a)}">` : "");
  const stat = (k) => (D.stats[k] ? `<img class="st-ico" src="${treeImg(D.stats[k])}" alt="" title="${esc(k)}">` : "");
  const res = (k) => (D.res[k] ? `<img class="st-ico" src="${treeImg(D.res[k])}" alt="" title="${esc(k)}">` : "");
  const attr = (type, id) => `data-gk="${type}:${esc(id)}"`;

  // ── Texto → íconos ────────────────────────────────────────────────────────
  let NAME_RE = null, CIV_RE = null, CIV_BY_NAME = null;
  const nameRe = () => {
    if (NAME_RE === null) {
      const names = Object.keys(D.names).sort((a, b) => b.length - a.length).map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
      NAME_RE = names.length ? new RegExp(`(?<![\\p{L}\\p{N}_-])(${names.join("|")})(?![\\p{L}\\p{N}_])`, "giu") : false;
    }
    return NAME_RE;
  };
  const civRe = () => {
    if (CIV_RE === null) {
      CIV_BY_NAME = Object.fromEntries(Object.entries(D.civInfo).map(([slug, c]) => [c.n, slug]));
      const names = Object.keys(CIV_BY_NAME).sort((a, b) => b.length - a.length);
      CIV_RE = names.length ? new RegExp(`(?<![A-Za-z])(${names.join("|")})(?![A-Za-z])`, "g") : false;
    }
    return CIV_RE;
  };
  // Opera sobre HTML ya escapado: solo toca los segmentos de texto (no los tags).
  const mapText = (html, re, fn) => (re ? html.split(/(<[^>]+>)/).map((seg, i) => (i % 2 ? seg : seg.replace(re, fn))).join("") : html);
  const iconize = (html) => mapText(html, nameRe(), (m) => {
    const id = D.names[m.toLowerCase()];
    return id ? `<span class="ic-run">${ico(id, "ico-s")}${m}</span>` : m;
  });
  const civify = (html) => mapText(html, civRe(), (m) => `<span class="ic-run">${emb(CIV_BY_NAME[m], "emb-s")}${m}</span>`);

  // ── Contenido del hover ───────────────────────────────────────────────────
  const AGE = ["Dark Age", "Feudal Age", "Castle Age", "Imperial Age"];
  const KIND_ES = { unit: "Unidad", upgrade: "Unidad mejorada", tech: "Tecnología", building: "Edificio", defencive: "Defensa" };
  const POS_ES = { flank: "Flanco", pocket: "Pocket", flex: "Flexible" };
  const cost = (c) => ["food", "wood", "gold", "stone"].filter((k) => c?.[k]).map((k) => `<span class="gk-c">${res(k)}${c[k]}</span>`).join("");
  const secs = (s) => `${s} s`;
  const cut = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + "…" : s);

  const itemTip = (id) => {
    const it = D.items[id]; if (!it) return "";
    const unit = it.k === "unit", build = it.k === "building";
    const sub = [KIND_ES[it.ty] || "", AGE[it.a] || "", it.w && D.items[it.w] ? `en ${D.items[it.w].n}` : ""].filter(Boolean).join(" · ");
    let h = `<div class="gk-head"><span class="gk-box k-${it.k}"><img src="${treeImg(it.i)}" alt=""></span>
      <div><div class="gk-name">${esc(it.n)}</div>${it.es ? `<div class="gk-es">${esc(it.es)}</div>` : ""}</div></div><div class="gk-sub">${esc(sub)}</div>`;
    const s = it.st;
    if (s) {
      const rows = [];
      if (s.hp) rows.push(`${stat("hp")}<b>${s.hp}</b> PV`);
      if (s.atk) rows.push(`${stat("attack")}<b>${s.atk}</b> ataque`);
      if (s.arm) rows.push(`${stat("armor")}<b>${s.arm[0]}</b> ${stat("pierce")}<b>${s.arm[1]}</b> armadura`);
      if (s.rng) rows.push(`${stat("range")}<b>${s.rng}</b> rango`);
      if (s.spd) rows.push(`${stat("speed")}<b>${s.spd}</b> velocidad`);
      if (s.rof) rows.push(`${stat("rof")}<b>${s.rof}</b> s por golpe`);
      if (rows.length) h += `<div class="gk-stats">${rows.map((r) => `<span>${r}</span>`).join("")}</div>`;
    }
    const costs = [];
    if (it.c) costs.push(`<div class="gk-row"><span class="gk-lbl">${build ? "Construcción" : unit ? "Producción" : "Costo"}</span>${cost(it.c)}${it.t || it.bt ? `<span class="gk-t">${secs(it.t || it.bt)}</span>` : ""}</div>`);
    if (it.rc) costs.push(`<div class="gk-row"><span class="gk-lbl">${it.k === "tech" ? "Investigación" : "Mejora"}</span>${cost(it.rc)}${it.rt ? `<span class="gk-t">${secs(it.rt)}</span>` : ""}</div>`);
    h += costs.join("");
    if (it.ef) h += `<p class="gk-text">${esc(it.ef)}</p>`;
    if (it.bo) h += `<div class="gk-row"><span class="gk-lbl">Bonus</span>${Object.entries(it.bo).map(([k, v]) => `<span class="gk-c">+${v} vs ${esc(k)}</span>`).join("")}</div>`;
    if (it.sg) h += `<div class="gk-rel"><b>Fuerte contra</b> ${esc(cut(it.sg, 130))}</div>`;
    if (it.wk) h += `<div class="gk-rel"><b>Débil contra</b> ${esc(cut(it.wk, 130))}</div>`;
    if (it.pr?.length) h += `<div class="gk-rel"><b>Produce</b><span class="gk-prod">${it.pr.map((p) => `<span>${ico(p, "ico-s no-gk")}${esc(D.items[p].n)}</span>`).join("")}</span></div>`;
    if (it.av?.length) h += `<div class="gk-rel"><b>Solo</b> ${it.av.map((c) => `${emb(c, "emb-s no-gk")}${esc(D.civInfo[c]?.n || c)}`).join(", ")}</div>`;
    else if (it.nv && it.nv < D.totalCivs) h += `<div class="gk-rel"><b>Disponible en</b> ${it.nv} de ${D.totalCivs} civs</div>`;
    return h;
  };
  const civTip = (slug) => {
    const c = D.civInfo[slug]; if (!c) return "";
    let h = `<div class="gk-head"><span class="gk-seal">${emb(slug, "emb-l no-gk")}</span><div><div class="gk-name">${esc(c.n)}</div>
      <div class="gk-es">${esc(POS_ES[c.pos] || "")}${c.ph ? ` · Phosphor Rush ${esc(c.ph)}` : ""}</div></div></div>`;
    if (c.sp) h += `<div class="gk-sub">${esc(c.sp)}</div>`;
    if (c.tb) h += `<p class="gk-text"><b>Equipo:</b> ${esc(c.tb)}</p>`;
    if (c.st.length) h += `<ul class="gk-list ok">${c.st.map((x) => `<li>${esc(cut(x, 90))}</li>`).join("")}</ul>`;
    if (c.wk.length) h += `<ul class="gk-list no">${c.wk.map((x) => `<li>${esc(cut(x, 90))}</li>`).join("")}</ul>`;
    return h;
  };
  const tipHtml = (spec) => { const [type, ...r] = spec.split(":"); const id = r.join(":"); return type === "c" ? civTip(id) : itemTip(id); };

  // ── Tooltip (un solo nodo para toda la app) ───────────────────────────────
  let tip = null, cur = null, timer = null;
  const touch = () => matchMedia("(hover: none)").matches;
  const ensure = () => tip || (tip = Object.assign(document.body.appendChild(document.createElement("div")), { className: "gk-tip", role: "tooltip" }));
  const hide = () => { clearTimeout(timer); cur = null; if (tip) tip.classList.remove("on"); };
  function show(el) {
    const html = tipHtml(el.dataset.gk || "");
    if (!html) return;
    // el hover propio reemplaza al title nativo
    for (const t of [el, ...el.querySelectorAll("[title]")]) if (t.title) { t.dataset.gkTitle = t.title; t.removeAttribute("title"); }
    const t = ensure(); t.innerHTML = html; cur = el;
    t.style.left = "0px"; t.style.top = "0px"; t.classList.add("on");
    const r = el.getBoundingClientRect(), w = t.offsetWidth, h = t.offsetHeight, vw = innerWidth, vh = innerHeight, m = 8;
    let x = r.left + r.width / 2 - w / 2; x = Math.max(m, Math.min(x, vw - w - m));
    let y = r.bottom + 8; if (y + h > vh - m) y = Math.max(m, r.top - h - 8);
    t.style.left = `${Math.round(x)}px`; t.style.top = `${Math.round(y)}px`;
  }
  const target = (e) => e.target?.closest?.("[data-gk]");
  document.addEventListener("mouseover", (e) => {
    if (touch()) return;
    const el = target(e); if (!el || el === cur) return;
    clearTimeout(timer); timer = setTimeout(() => show(el), 120);
  });
  document.addEventListener("mouseout", (e) => {
    const el = target(e); if (!el) return;
    if (e.relatedTarget && el.contains(e.relatedTarget)) return;
    hide();
  });
  document.addEventListener("focusin", (e) => { const el = target(e); if (el) show(el); });
  document.addEventListener("focusout", hide);
  document.addEventListener("click", (e) => {                       // táctil: un toque abre, otro toque (o fuera) cierra
    if (!touch()) return;
    const el = target(e);
    if (el && el !== cur) show(el); else hide();
  }, true);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") hide(); });
  addEventListener("scroll", hide, true); addEventListener("resize", hide); addEventListener("blur", hide);

  // ── Automático: [data-gk-auto] ────────────────────────────────────────────
  // Los títulos (h1–h4) y las pestañas/etiquetas no se tocan: el ícono va en el texto corrido, no en el rótulo.
  // (se mira cualquier ancestro, no solo el padre: un <b> dentro de un <h3> también queda afuera)
  const SKIP = "script,style,textarea,input,select,option,button,code,pre,svg,img,noscript,h1,h2,h3,h4,summary,.ic-run,[data-gk-skip],.gk-tip";
  function enhance(root, mode = "items") {
    if (D === EMPTY) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode(n) {
      const p = n.parentElement;
      if (!p || p.closest(SKIP)) return NodeFilter.FILTER_REJECT;
      return n.nodeValue.trim().length > 2 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    } });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) {
      const raw = esc(n.nodeValue);
      let html = raw;
      if (mode === "civs" || mode === "all") html = civify(html);
      if (mode === "items" || mode === "all") html = iconize(html);
      if (html !== raw) { const box = document.createElement("span"); box.innerHTML = html; n.replaceWith(...box.childNodes); }
    }
  }
  const modeOf = (host) => host.getAttribute("data-gk-auto") || "items";
  const scan = (root = document) => root.querySelectorAll?.("[data-gk-auto]").forEach((h) => enhance(h, modeOf(h)));
  let queued = new Set(), pending = 0;   // setTimeout y no rAF: sigue andando con la pestaña en segundo plano
  const flush = () => { pending = 0; const q = queued; queued = new Set(); q.forEach((n) => { if (!n.isConnected) return; const h = n.closest?.("[data-gk-auto]"); if (h) enhance(n, modeOf(h)); }); };
  new MutationObserver((muts) => {
    for (const m of muts) for (const n of m.addedNodes) {
      if (n.nodeType === 1 && n.classList?.contains("gk-tip")) continue;
      const el = n.nodeType === 1 ? n : n.parentElement;
      if (el?.closest?.("[data-gk-auto]") || el?.querySelector?.("[data-gk-auto]")) queued.add(el);
    }
    if (queued.size && !pending) pending = setTimeout(flush, 30);
  }).observe(document.documentElement, { childList: true, subtree: true });

  // ── Carga ─────────────────────────────────────────────────────────────────
  const ready = fetch("/api/icons").then((r) => r.json()).then((d) => { D = d; NAME_RE = CIV_RE = null; scan(); return d; })
    .catch((e) => { console.warn("[GameKit] sin catálogo de íconos:", e.message); return EMPTY; });

  window.GK = {
    ready, ico, emb, age, ageIco: age, stat, statIco: stat, res, resIc: res, attr, iconize, civify, enhance, scan, hide,
    get data() { return D; },
    civName: (slug) => D.civInfo[slug]?.n || slug,
  };
})();
