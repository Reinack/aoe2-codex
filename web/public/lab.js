// Lab: vista con pestañas. Depende de las globales de index.html: api(), esc(), switchView().
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const md = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const mmss = (t) => `${Math.floor(t / 60)}:${String(Math.round(t % 60)).padStart(2, "0")}`;
const parseT = (s) => { const m = String(s || "").trim().match(/^(\d{1,2})(?::(\d{2}))?$/); return m ? (+m[1]) * 60 + (+(m[2] || 0)) : null; };
const store = {
  get(k, d) { try { return JSON.parse(localStorage.getItem("lab:" + k)) ?? d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem("lab:" + k, JSON.stringify(v)); } catch {} },
};
const cache = {};
const get = (url) => (cache[url] ||= api(url));

let CIVS = [];                 // [{slug,name,position,...}]
const civName = (s) => CIVS.find((c) => c.slug === s)?.name || s;

const TABS = [
  ["builds", "🗒️ Build orders"], ["timings", "⏱️ Timings"], ["maps", "🗺️ Mapas"], ["scouting", "🔭 Scouting"],
  ["team", "👥 Team Lab"], ["draft", "⚖️ Draft"], ["sim", "🧪 Simulador"],
  ["compare", "🆚 Comparar civs"], ["study", "🧠 Estudio"],
];
let tab = store.get("tab", "builds");

// ── Selector de civs (select + chips) ────────────────────────────────────
function civPicker(el, { max = 4, key, onChange, placeholder = "Agregar civ…" }) {
  let sel = key ? store.get(key, []) : [];
  const draw = () => {
    el.innerHTML = `<div>${sel.map((s) => `<span class="lab-chip">${esc(civName(s))}<span class="x" data-x="${s}">×</span></span>`).join("")}</div>
      ${sel.length < max ? `<select><option value="">${esc(placeholder)}</option>${CIVS.filter((c) => !sel.includes(c.slug))
        .map((c) => `<option value="${c.slug}">${esc(c.name)}</option>`).join("")}</select>` : ""}`;
    $("select", el)?.addEventListener("change", (e) => { if (e.target.value) { sel.push(e.target.value); commit(); } });
    $$(".x", el).forEach((x) => x.onclick = () => { sel = sel.filter((s) => s !== x.dataset.x); commit(); });
  };
  const commit = () => { if (key) store.set(key, sel); draw(); onChange?.(sel); };
  draw();
  return { get: () => sel, set: (v) => { sel = v; commit(); } };
}
const civSelect = (id, val = "", blank = "—") =>
  `<select id="${id}"><option value="">${blank}</option>${CIVS.map((c) => `<option value="${c.slug}" ${c.slug === val ? "selected" : ""}>${esc(c.name)}</option>`).join("")}</select>`;

// ── Entrada ───────────────────────────────────────────────────────────────
window.initLab = async function initLab() {
  const root = $("#view-lab");
  if (!root.dataset.ready) {
    root.dataset.ready = "1";
    root.innerHTML = `<div class="lab-tabs" id="lab-tabs">${TABS.map(([k, l]) =>
      `<a class="lab-tab" data-tab="${k}">${l}</a>`).join("")}</div><div id="lab-body"></div>
      <div id="bo-overlay"></div>`;
    $$(".lab-tab", root).forEach((t) => t.onclick = () => openTab(t.dataset.tab));
    CIVS = await get("/api/team-civs");
  }
  openTab(tab);
};

function openTab(k) {
  tab = k; store.set("tab", k);
  $$(".lab-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === k));
  const body = $("#lab-body");
  body.innerHTML = "";
  ({ builds, timings, maps, scouting, team, draft, sim, compare, study }[k])(body);
}

// ══ 1. BUILD ORDERS ══════════════════════════════════════════════════════
let boTimer = { t: 0, run: false, id: null, last: 0, marks: {} };
let boState = { build: null, sec: 0, step: 0, voice: false };
function builds(body) {
  body.innerHTML = `<p class="lab-intro"><b>Build orders del vault</b>, paso a paso. Clic en una fila (o <b>Espacio</b>) avanza el paso; el timer corre aparte y
    podés marcar el click a Feudal/Castle para compararlo con el benchmark. El <b>overlay</b> queda flotante sobre la página o en una ventana aparte.</p>
    <div class="lab-panel calc-panel"><div class="lab-row"><label>Build<select id="bo-sel"></select></label></div>
    <div class="bo-meta" id="bo-meta"></div></div><div id="bo-main"></div>`;
  get("/api/build-orders").then(({ builds: B }) => {
    const sel = $("#bo-sel");
    sel.innerHTML = B.map((b) => `<option value="${b.id}">${esc(b.title)}</option>`).join("");
    const saved = store.get("bo", B[0].id);
    sel.value = B.some((b) => b.id === saved) ? saved : B[0].id;
    const show = () => { store.set("bo", sel.value); boState = { ...boState, build: B.find((b) => b.id === sel.value), sec: 0, step: 0 }; drawBuild(); };
    sel.onchange = show; show();
    const p = new URLSearchParams(location.search);
    if (p.get("lab") === "overlay") { sel.value = p.get("bo") || sel.value; show(); }
  });
}
function drawBuild() {
  const b = boState.build; if (!b) return;
  $("#bo-meta").innerHTML = `<div><b>Civs:</b> ${esc(b.civs || "—")}</div><div><b>Mapas:</b> ${esc(b.maps || "—")} &nbsp; <b>Tipo:</b> ${esc(b.type || "—")} &nbsp; <b>Dificultad:</b> ${esc(b.difficulty || "—")}</div><div><i>${esc(b.quote)}</i></div>`;
  const sec = b.sections[boState.sec];
  $("#bo-main").innerHTML = `<div class="lab-grid two">
    <div class="lab-panel calc-panel">
      <div class="lab-row"><label>Sección<select id="bo-sec">${b.sections.map((s, i) =>
        `<option value="${i}" ${i === boState.sec ? "selected" : ""}>${esc(s.title)}${s.variant ? " (variante)" : ""}</option>`).join("")}</select></label></div>
      <table class="lab-table bo-steps"><thead><tr><th>${sec.unit === "step" ? "Paso" : sec.unit === "list" ? "" : "Pob."}</th><th>Acción</th></tr></thead>
      <tbody>${sec.steps.map((s, i) => `<tr data-i="${i}" class="${i < boState.step ? "done" : i === boState.step ? "cur" : ""}"><td class="at">${esc(s.at)}</td><td>${md(s.do)}</td></tr>`).join("")}</tbody></table>
      <div class="lab-row" style="margin-top:10px"><button class="calc-btn" id="bo-prev">◀ Atrás</button><button class="calc-btn primary" id="bo-next">Siguiente ▶ (Espacio)</button>
        <button class="calc-btn" id="bo-reset-steps">Reiniciar pasos</button></div>
      <div class="lab-src">Fuente: <code>${esc(b.note)}</code></div>
    </div>
    <div class="lab-panel calc-panel">
      <h3>Timer</h3>
      <div><span class="bo-timer" id="bo-t">0:00</span>
        <button class="calc-btn primary" id="bo-go">▶ Iniciar</button> <button class="calc-btn" id="bo-rst">↺ Reset</button></div>
      <div class="lab-row" style="margin-top:10px"><button class="calc-btn" data-mark="feudal">Marcar Feudal</button>
        <button class="calc-btn" data-mark="castle">Marcar Castle</button></div>
      <div id="bo-marks" class="lab-small"></div><div id="bo-medal"></div>
      <h4>Overlay y exportación</h4>
      <div class="lab-row inline"><button class="calc-btn" id="bo-ovl">🪟 Overlay en página</button><button class="calc-btn" id="bo-pop">↗ Ventana aparte</button>
        <button class="calc-btn" id="bo-exp">⬇ JSON</button>
        <label><input type="checkbox" id="bo-voice" ${boState.voice ? "checked" : ""}> voz por paso</label></div>
      <p class="lab-small">En la ventana aparte el estado no se comparte: usá su propio timer. El JSON exporta los pasos de esta sección.</p>
    </div></div>`;
  $("#bo-sec").onchange = (e) => { boState.sec = +e.target.value; boState.step = 0; drawBuild(); };
  $$(".bo-steps tr[data-i]").forEach((tr) => tr.onclick = () => { boState.step = +tr.dataset.i; speak(); markSteps(); });
  $("#bo-next").onclick = () => nextStep(1); $("#bo-prev").onclick = () => nextStep(-1);
  $("#bo-reset-steps").onclick = () => { boState.step = 0; markSteps(); };
  $("#bo-go").onclick = toggleTimer; $("#bo-rst").onclick = () => { boTimer = { ...boTimer, t: 0, run: false, marks: {} }; clearInterval(boTimer.h); paintTimer(); };
  $$("[data-mark]").forEach((x) => x.onclick = () => { boTimer.marks[x.dataset.mark] = boTimer.t; paintTimer(); });
  $("#bo-ovl").onclick = () => { $("#bo-overlay").classList.toggle("on"); paintOverlay(); };
  $("#bo-pop").onclick = () => window.open(`/?lab=overlay&bo=${b.id}`, "bo", "width=380,height=460");
  $("#bo-voice").onchange = (e) => boState.voice = e.target.checked;
  $("#bo-exp").onclick = () => {
    const blob = new Blob([JSON.stringify({ name: b.title, source: b.note, section: sec.title,
      build_order: sec.steps.map((s) => ({ at: s.at, notes: [s.do.replace(/\*\*/g, "")] })) }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `${b.id}.json`; a.click();
  };
  paintTimer(); paintOverlay();
}
function markSteps() {
  $$(".bo-steps tr[data-i]").forEach((tr) => { const i = +tr.dataset.i;
    tr.className = i < boState.step ? "done" : i === boState.step ? "cur" : ""; });
  paintOverlay();
}
function nextStep(d) {
  const sec = boState.build.sections[boState.sec];
  boState.step = Math.max(0, Math.min(sec.steps.length, boState.step + d));
  if (d > 0) speak(); markSteps();
}
function speak() {
  if (!boState.voice || !window.speechSynthesis) return;
  const s = boState.build.sections[boState.sec].steps[boState.step]; if (!s) return;
  speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(s.do.replace(/\*\*/g, "")); u.lang = "es-UY"; speechSynthesis.speak(u);
}
function toggleTimer() {
  boTimer.run = !boTimer.run;
  clearInterval(boTimer.h);
  if (boTimer.run) { boTimer.last = Date.now(); boTimer.h = setInterval(() => { const n = Date.now(); boTimer.t += (n - boTimer.last) / 1000; boTimer.last = n; paintTimer(); }, 250); }
  paintTimer();
}
async function paintTimer() {
  $("#bo-t") && ($("#bo-t").textContent = mmss(boTimer.t));
  $("#bo-go") && ($("#bo-go").textContent = boTimer.run ? "⏸ Pausar" : "▶ Iniciar");
  const mk = boTimer.marks;
  $("#bo-marks") && ($("#bo-marks").textContent = Object.entries(mk).map(([k, v]) => `${k}: ${mmss(v)}`).join(" · "));
  paintOverlay();
  if (!$("#bo-medal") || !boState.build) return;
  const T = await get("/api/timings");
  const ref = T.builds.find((x) => x.buildId === boState.build.id);
  if (!ref) { $("#bo-medal").innerHTML = ""; return; }
  const out = [];
  for (const k of ["feudal", "castle"]) if (mk[k] != null && ref[k]) out.push(medal(k, mk[k], ref[k], ref.label));
  $("#bo-medal").innerHTML = out.join("");
}
function medal(age, t, ref, label) {
  const goal = ref.max ?? ref.t2 ?? ref.t; const d = t - goal;
  const m = d <= 0 ? ["🥇", "oro"] : d <= 30 ? ["🥈", "plata"] : d <= 60 ? ["🥉", "bronce"] : ["⚪", "sin medalla"];
  return `<div><span class="lab-medal">${m[0]}</span> ${age[0].toUpperCase() + age.slice(1)} ${mmss(t)} vs ${ref.max ? "≤" : ref.approx ? "≈" : ""}${mmss(goal)} → ${m[1]} (${d > 0 ? "+" : ""}${Math.round(d)} s) <span class="lab-small">${esc(label)}</span></div>`;
}
function paintOverlay() {
  const o = $("#bo-overlay"); if (!o || !boState.build) return;
  const sec = boState.build.sections[boState.sec]; const st = sec.steps;
  o.innerHTML = `<div class="t">${mmss(boTimer.t)} <button id="bo-o-go">${boTimer.run ? "⏸" : "▶"}</button></div>
    <div class="lab-small" style="color:var(--on-dark-dim)">${esc(boState.build.title)} · ${esc(sec.title)}</div>
    <div class="cur">${st[boState.step] ? `<b>${esc(st[boState.step].at)}</b> ${md(st[boState.step].do)}` : "✔ Sección completa"}</div>
    ${st.slice(boState.step + 1, boState.step + 4).map((s) => `<div class="nx">${esc(s.at)} · ${md(s.do)}</div>`).join("")}
    <div style="margin-top:6px"><button id="bo-o-prev">◀</button> <button id="bo-o-next">▶</button></div>`;
  $("#bo-o-go").onclick = toggleTimer; $("#bo-o-next").onclick = () => nextStep(1); $("#bo-o-prev").onclick = () => nextStep(-1);
}
document.addEventListener("keydown", (e) => {
  if (tab !== "builds" || !boState.build || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  const vis = $("#view-lab")?.style.display !== "none" || document.body.classList.contains("lab-ovl-only");
  if (!vis) return;
  if (e.code === "Space") { e.preventDefault(); nextStep(1); }
  if (e.code === "Backspace") { e.preventDefault(); nextStep(-1); }
});

// ══ 2. TIMINGS ═══════════════════════════════════════════════════════════
async function timings(body) {
  const T = await get("/api/timings");
  const MAX = 35 * 60, pc = (t) => (t / MAX * 100).toFixed(2) + "%";
  const ticks = [0, 5, 10, 15, 20, 25, 30, 35].map((m) => `<span style="left:${pc(m * 60)}">${m}'</span>`).join("");
  const row = (label, sub, marks) => `<div class="tl-row"><div class="tl-lbl">${esc(label)}<small>${esc(sub || "")}</small></div><div class="tl-track">${marks}</div></div>`;
  const rows = T.builds.map((b) => {
    let m = "";
    if (b.feudal) m += `<span class="tl-m f" style="left:${pc(b.feudal.t)}" title="Feudal ${mmss(b.feudal.t)}"></span>`;
    if (b.castle) {
      if (b.castle.t2) m += `<span class="tl-bar" style="left:${pc(b.castle.t)};width:calc(${pc(b.castle.t2)} - ${pc(b.castle.t)})"></span>`;
      if (b.castle.max) m += `<span class="tl-bar max" style="left:0;width:${pc(b.castle.max)}"></span><span class="tl-m c" style="left:${pc(b.castle.max)}" title="Castle antes de ${mmss(b.castle.max)}"></span>`;
      else m += `<span class="tl-m c" style="left:${pc(b.castle.t)}" title="Castle ${mmss(b.castle.t)}"></span>`;
    }
    return row(b.label, `${b.villagers !== "—" ? b.villagers + " aldeanos · " : ""}${[b.feudal?.text, b.castle?.text].filter(Boolean).join(" · ")}`, m);
  }).join("") + T.imperial.map((i) => row(i.label, i.text, `<span class="tl-m i" style="left:${pc(i.t)}"></span>`)).join("");
  body.innerHTML = `<p class="lab-intro"><b>Benchmarks de timing</b> citados de la wiki — cada fila trae su nota de origen. ${esc(T.ageCosts.feudal)}</p>
    <div class="lab-panel calc-panel"><h3>Línea de tiempo</h3><div class="tl"><div class="tl-axis">${ticks}</div>${rows}</div>
      <div class="tl-leg"><span class="lab-tag age-1">Feudal</span> <span class="lab-tag age-2">Castle</span> <span class="lab-tag age-3">Imperial</span> la barra de Castle marca un rango o un "antes de".</div>
      <p class="lab-small">${esc(T.eloSignal)}</p></div>
    <div class="lab-grid two">
      <div class="lab-panel calc-panel"><h3>Mi partida vs benchmark</h3>
        <div class="lab-row"><label>Referencia<select id="tm-ref">${T.builds.map((b, i) => `<option value="${i}">${esc(b.label)}</option>`).join("")}</select></label></div>
        <div class="lab-row"><label>Click a Feudal (m:ss)<input id="tm-f" placeholder="9:10" size="6"></label><label>Click a Castle (m:ss)<input id="tm-c" placeholder="14:30" size="6"></label>
          <button class="calc-btn primary" id="tm-go">Comparar</button></div><div id="tm-out"></div></div>
      <div class="lab-panel calc-panel"><h3>Ventanas y avisos</h3>${T.windows.map((w) =>
        `<p><b>${esc(w.label)}.</b> ${esc(w.text)}<span class="lab-src"> · ${esc(w.source)}</span></p>`).join("")}
        <h4>Fuentes de los benchmarks</h4>${T.builds.map((b) => `<div class="lab-small">${esc(b.label)} — <code>${esc(b.source)}</code>${b.buildId ? ` · <a href="#" data-bo="${b.buildId}">ver build</a>` : ""}</div>`).join("")}</div></div>`;
  $$("[data-bo]", body).forEach((a) => a.onclick = (e) => { e.preventDefault(); store.set("bo", a.dataset.bo); openTab("builds"); });
  $("#tm-go").onclick = () => {
    const ref = T.builds[+$("#tm-ref").value], out = [];
    const f = parseT($("#tm-f").value), c = parseT($("#tm-c").value);
    if (f != null && ref.feudal) out.push(medal("feudal", f, ref.feudal, ref.label));
    if (c != null && ref.castle) out.push(medal("castle", c, ref.castle, ref.label));
    if (f != null && !ref.feudal) out.push(`<div class="lab-small">Esta referencia no tiene benchmark de Feudal.</div>`);
    $("#tm-out").innerHTML = out.join("") || `<div class="lab-small">Ingresá tiempos con formato m:ss.</div>`;
  };
}

// ══ 3. SCOUTING ══════════════════════════════════════════════════════════
function scouting(body) {
  body.innerHTML = `<p class="lab-intro"><b>Árbol de scouting:</b> qué viste → qué significa → qué hacer. Elegí al rival para ver su <b>counter-play</b> y,
    si jugás en equipo (2v2–4v4), tu equipo para saber <b>quién puede ejecutar cada respuesta</b> según su árbol.</p>
    <div class="lab-panel calc-panel"><div class="lab-row"><label>Civ rival${civSelect("sc-vs", store.get("sc-vs", ""))}</label>
      <label style="flex:1">Mi equipo (hasta 4)<div id="sc-team"></div></label></div></div><div id="sc-out"></div>`;
  const run = async () => {
    const vs = $("#sc-vs").value; store.set("sc-vs", vs);
    const d = await api(`/api/scouting?vs=${vs}&team=${tp.get().join(",")}`);
    $("#sc-out").innerHTML = `<div class="lab-grid two"><div>${d.stages.map((st) => `<div class="lab-panel calc-panel"><h3>${esc(st.title)} <span class="lab-small">· ${esc(st.when)}</span></h3>
      <p class="lab-small">${esc(st.tip)}</p>${st.signals.map((s) => `<div class="sc-sig"><div class="s">👁 ${esc(s.signal)}</div><div class="m">→ ${esc(s.means)}</div>
        <div class="r"><b>Reacción:</b> ${esc(s.reaction)}</div>
        ${s.who.some((w) => w.can !== null) ? `<div>${s.who.map((w) => `<span class="lab-chip ${w.can ? "ok" : "no"}">${w.can ? "✔" : "✖"} ${esc(civName(w.civ))}${w.unit ? " · " + esc(w.unit) : ""}</span>`).join("")}</div>` : ""}
        <div class="lab-src">${esc(s.source)}</div></div>`).join("")}</div>`).join("")}</div>
      <div>${d.vs ? vsPanel(d.vs) : `<div class="lab-panel calc-panel lab-small">Elegí una civ rival para ver cómo jugarle.</div>`}</div></div>`;
  };
  const tp = civPicker($("#sc-team"), { max: 4, key: "sc-teamciv", onChange: run });
  $("#sc-vs").onchange = run; run();
}
function vsPanel(v) {
  return `<div class="lab-panel calc-panel"><h3>Contra ${esc(v.name)}</h3><div class="lab-small">${esc(v.specialty)}</div>
    ${v.phosphor ? `<p>🔥 Phosphor Rush (FC all-in Arabia): <span class="lab-tag ${v.phosphor.tier}">${esc(v.phosphor.tier)}</span> ${esc(v.phosphor.uu || "")} <span class="lab-small">(${esc(v.phosphor.strength || "")})</span></p>` : ""}
    ${v.counterPlay.length ? `<h4>Cómo jugarle</h4><ul>${v.counterPlay.map((x) => `<li>${md(typeof x === "string" ? x : x.text || JSON.stringify(x))}</li>`).join("")}</ul>` : ""}
    ${v.weaknesses.length ? `<h4>Debilidades</h4><ul>${v.weaknesses.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}</div>`;
}

// ══ 4. TEAM LAB ══════════════════════════════════════════════════════════
function team(body) {
  body.innerHTML = `<p class="lab-intro"><b>Team Lab:</b> armá tu equipo de 1 a 4 civs. Asigna <b>flanco</b> y <b>pocket</b> según el perfil de cada civ en la wiki
    (2v2 = 1 flanco + 1 pocket, 3v3 = 2 + 1, 4v4 = 2 + 2), marca sinergias de bonus de equipo y muestra qué línea de unidades cubre cada jugador y qué <b>huecos</b> quedan.</p>
    <div class="lab-panel calc-panel"><div id="tm-pick"></div></div><div id="tm-out"></div>`;
  const run = async (sel) => {
    if (!sel.length) { $("#tm-out").innerHTML = ""; return; }
    const d = await api(`/api/team?civs=${sel.join(",")}`);
    if (d.error) { $("#tm-out").innerHTML = `<div class="lab-panel calc-panel">${esc(d.error)}</div>`; return; }
    $("#tm-out").innerHTML = `<div class="lab-grid two"><div class="lab-panel calc-panel"><h3>Posiciones <span class="lab-small">· ajuste ${d.score}/${d.maxScore}</span></h3>
      ${d.players.map((p) => `<div class="tm-slot"><div class="tm-pos">${p.slot === "flank" ? "Flanco" : p.slot === "pocket" ? "Pocket" : "—"}</div>
        <div><b>${esc(p.name)}</b> <span class="lab-tag ${p.position}">${p.position}</span> <span class="lab-small">${esc(p.fit)}</span>
        <div class="lab-small">${esc(p.specialty)}</div><div>🤝 ${esc(p.teamBonus || "sin bonus de equipo registrado")}</div>
        ${p.notes.slice(0, 2).map((n) => `<div class="lab-small">· ${esc(n)}</div>`).join("")}</div></div>`).join("")}
      ${d.links.length ? `<h4>Sinergias entre los elegidos</h4>${d.links.map((l) => `<div class="lab-small">${l.kind === "bonus" ? "🤝" : "✨"} ${esc(l.text)}</div>`).join("")}` : `<p class="lab-small">Ninguna sinergia directa registrada entre estas civs.</p>`}</div>
      <div class="lab-panel calc-panel"><h3>Cobertura del equipo</h3>
        ${d.gaps.length ? `<p>⚠️ Huecos: <b>${esc(d.gaps.join(", "))}</b></p>` : `<p>✔ Sin huecos de unidades.</p>`}
        <table class="lab-table"><thead><tr><th>Línea</th>${d.players.map((p) => `<th>${esc(p.name)}</th>`).join("")}</tr></thead><tbody>
        ${d.coverage.map((c) => `<tr class="${c.gap ? "cov-gap" : ""}"><td>${esc(c.label)}</td>${c.who.map((w) => `<td class="${c.best.includes(w.civ) && w.unit ? "cov-best" : ""}">${w.unit ? esc(w.unit) : "—"}</td>`).join("")}</tr>`).join("")}</tbody></table>
        <p class="lab-small">En verde, quien tiene la mejor versión de la línea: es quien conviene que la produzca. Basado en el árbol tecnológico de cada civ.</p></div></div>`;
  };
  civPicker($("#tm-pick"), { max: 4, key: "tm-civs", onChange: run, placeholder: "Agregar civ al equipo…" });
  run(store.get("tm-civs", []));
}

// ══ 5. DRAFT ═════════════════════════════════════════════════════════════
const MAPS = [["open", "Abierto (Arabia…)"], ["closed", "Cerrado (Arena, Black Forest…)"], ["water", "Agua"], ["nomad", "Nómada"]];
const PHB = { S: 2, A: 1.4, B: 0.7, C: 0.2, D: 0 };
function draft(body) {
  body.innerHTML = `<p class="lab-intro"><b>Helper de draft:</b> puntúa cada civ por mapa con el <b>radar del vault</b> (0–10 en Abierto/Cerrado/Agua/Nómada) y, en mapa abierto, suma la tier de Phosphor Rush (FC all-in en Arabia).
    Descontá las civs ya usadas en la serie y los bans; el helper sugiere <b>picks</b> y <b>bans</b> (las civs más fuertes del rival en ese mapa). En equipos filtra por <b>posición</b>.</p>
    <div class="lab-panel calc-panel"><div class="lab-row">
      <label>Formato<select id="dr-fmt"><option value="1">1v1</option><option value="2">2v2</option><option value="3">3v3</option><option value="4">4v4</option></select></label>
      <label>Serie<select id="dr-bo"><option value="1">Bo1</option><option value="3">Bo3</option><option value="5">Bo5</option></select></label>
      <label>Bans por lado<select id="dr-bans"><option>0</option><option selected>1</option><option>2</option><option>3</option></select></label>
      <label class="lab-small" style="flex-basis:100%"><span>Civs ya usadas por mí (no repiten en la serie)</span><div id="dr-mine"></div></label>
      <label class="lab-small" style="flex-basis:100%"><span>Civs ya usadas / baneadas por el rival</span><div id="dr-opp"></div></label>
    </div></div>
    <div class="lab-panel calc-panel"><h3>🎯 Contra un rival conocido</h3>
      <p class="lab-small">Cargá las civs que el rival ya pickeó o suele jugar: el helper puntúa tus candidatas contra cada una con el radar del vault (categorías débiles que podés explotar), el mapa y las partidas documentadas.</p>
      <div class="lab-row"><label style="flex:1">Civs del rival (hasta 5)<div id="dv-vs"></div></label>
        <label>Mapa<select id="dv-map">${MAPS.map(([k, l]) => `<option value="${k}">${l}</option>`).join("")}</select></label>
        <label>Posición<select id="dv-slot"><option value="flex">cualquiera</option><option value="flank">flanco</option><option value="pocket">pocket</option></select></label>
        <label>Bans<select id="dv-bans"><option>0</option><option selected>1</option><option>2</option><option>3</option></select></label></div>
      <div id="dv-out"></div></div>
    <div id="dr-out"></div>`;
  const dvRun = async () => {
    const vs = dvp.get(), out = $("#dv-out");
    if (!vs.length) { out.innerHTML = `<p class="lab-small">Elegí al menos una civ del rival.</p>`; return; }
    store.set("dv-map", $("#dv-map").value);
    const used = [...store.get("dr-mine", [])];
    const d = await api(`/api/draft-vs?vs=${vs.join(",")}&map=${$("#dv-map").value}&slot=${$("#dv-slot").value}&bans=${$("#dv-bans").value}&exclude=${used.join(",")}`);
    if (d.error) { out.innerHTML = `<p class="lab-small">${esc(d.error)}</p>`; return; }
    const max = Math.max(1, ...d.candidates.map((c) => Math.abs(c.score)));
    out.innerHTML = `${d.phosphorAlert.length ? `<p>🔥 <b>Alerta Phosphor Rush:</b> ${d.phosphorAlert.map((p) => `${esc(p.name)} (tier ${esc(p.tier)}${p.uu ? ", " + esc(p.uu) : ""})`).join(" · ")} — puede ir Fast Castle all-in en mapa abierto; mirá el scouting.</p>` : ""}
      <div class="lab-grid two"><div><h4>🟢 Mejores picks</h4><ol class="dr-list">${d.candidates.map((c) => `<li><b>${esc(c.name)}</b> <span class="lab-tag ${c.position}">${c.position}</span>
        <span class="lab-small">puntaje ${c.score}</span><span class="dr-bar" style="width:${Math.round(Math.max(0, c.score) / max * 90)}px"></span>
        <div class="lab-small">${c.reasons.map(esc).join(" · ")}</div>
        ${d.rivals.length > 1 ? `<div class="lab-small">${c.per.map((p) => `${esc(p.name)} ${p.total}`).join(" · ")}</div>` : ""}</li>`).join("")}</ol></div>
        <div><h4>🔴 Bans sugeridos</h4>${d.bans.length ? `<ol class="dr-list">${d.bans.map((b) => `<li><b>${esc(b.name)}</b> <span class="lab-small">amenaza a tus mejores picks: ${b.threat}</span></li>`).join("")}</ol>
          <p class="lab-small">Las civs del pool rival que más pelean contra tus 3 mejores picks.</p>` : `<p class="lab-small">Sin bans.</p>`}</div></div>
      <p class="lab-src">${esc(d.note)}</p>`;
  };
  const dvp = civPicker($("#dv-vs"), { max: 5, key: "dv-vs", onChange: dvRun, placeholder: "Agregar civ rival…" });
  $("#dv-map").value = store.get("dv-map", "open");
  ["dv-map", "dv-slot", "dv-bans"].forEach((id) => $("#" + id).onchange = dvRun);
  dvRun();
  get("/api/draft-data").then((D) => {
    const run = () => {
      const fmt = +$("#dr-fmt").value, nbo = +$("#dr-bo").value, nb = +$("#dr-bans").value;
      const used = new Set([...mine.get(), ...opp.get()]);
      const slots = fmt === 1 ? ["flex"] : { 2: ["flank", "pocket"], 3: ["flank", "pocket", "flank"], 4: ["flank", "pocket", "pocket", "flank"] }[fmt];
      const score = (c, m) => (c.axes?.[m] ?? 0) + (m === "open" ? (PHB[c.phosphor] ?? 0) : 0);
      const games = [];
      for (let g = 0; g < nbo; g++) {
        const map = $(`#dr-map${g}`)?.value || "open";
        const myTop = new Set(slots.flatMap((sl) => D.civs.filter((c) => !mine.get().includes(c.slug) && (sl === "flex" || c.position === sl || c.position === "flex"))
          .sort((a, b) => score(b, map) - score(a, map)).slice(0, 4).map((c) => c.slug)));
        games.push(`<div class="lab-panel calc-panel"><h3>Partida ${g + 1}</h3><div class="lab-row"><label>Mapa<select id="dr-map${g}">${MAPS.map(([k, l]) =>
          `<option value="${k}" ${k === map ? "selected" : ""}>${l}</option>`).join("")}</select></label></div>
          <div class="lab-grid two"><div><h4>🟢 Picks sugeridos</h4>${slots.map((sl) => {
            const pool = D.civs.filter((c) => !mine.get().includes(c.slug) && (sl === "flex" || c.position === sl || c.position === "flex"));
            const top = pool.sort((a, b) => score(b, map) - score(a, map)).slice(0, 4);
            return `<div class="lab-small"><b>${sl === "flex" ? "1v1" : sl === "flank" ? "Flanco" : "Pocket"}</b></div><ol class="dr-list">${top.map((c) => li(c, map, score)).join("")}</ol>`;
          }).join("")}</div>
          <div><h4>🔴 Bans sugeridos (${nb})</h4>${nb ? `<ol class="dr-list">${D.civs.filter((c) => !used.has(c.slug) && !myTop.has(c.slug)).sort((a, b) => score(b, map) - score(a, map)).slice(0, nb + 1).map((c) => li(c, map, score)).join("")}</ol>
            <p class="lab-small">Las civs más fuertes del mapa que no están entre tus picks sugeridos ni ya usadas: lo que el rival querría pickear.</p>` : `<p class="lab-small">Sin bans en este formato.</p>`}</div></div></div>`);
      }
      $("#dr-out").innerHTML = games.join("");
      $$("#dr-out select").forEach((s) => s.onchange = run);
    };
    const li = (c, m, f) => `<li><b>${esc(c.name)}</b> <span class="lab-tag ${c.position}">${c.position}</span><span class="lab-small">${c.axes ? `${m} ${c.axes[m]}` : "sin radar"}${m === "open" && c.phosphor ? ` · Phosphor ${c.phosphor}` : ""}</span><span class="dr-bar" style="width:${Math.round(f(c, m) * 6)}px"></span></li>`;
    const mine = civPicker($("#dr-mine"), { max: 5, key: "dr-mine", onChange: run }), opp = civPicker($("#dr-opp"), { max: 8, key: "dr-opp", onChange: run });
    ["dr-fmt", "dr-bo", "dr-bans"].forEach((id) => $("#" + id).onchange = run); run();
  });
}

// ══ 6. SIMULADOR ═════════════════════════════════════════════════════════
const simDef = store.get("simdef", null) || { a: [{ id: "paladin", count: 10 }], b: [{ id: "halberdier", count: 20 }], up: { a: [0, 0, 0], b: [0, 0, 0] },
  civ: { a: "", b: "" }, ally: { a: "", b: "" }, age: 3 };
simDef.civ ||= { a: "", b: "" }; simDef.ally ||= { a: "", b: "" }; if (simDef.age === undefined) simDef.age = 3;
const saveSim = () => store.set("simdef", simDef);
let SIM = null, SIMCIVS = [];
async function sim(body) {
  SIM = (await get("/api/sim/catalog")).units;
  SIMCIVS = (await get("/api/sim/civs")).civs;
  const civOpts = (sel) => `<option value="">— sin civ —</option>${SIMCIVS.map((c) => `<option value="${c.slug}" ${c.slug === sel ? "selected" : ""}>${esc(c.name)}</option>`).join("")}`;
  const opts = (sel) => SIM.map((u) => `<option value="${u.id}" ${u.id === sel ? "selected" : ""}>${esc(u.name)}</option>`).join("");
  const side = (k, label) => `<div class="lab-panel calc-panel"><h3>${label}</h3><div id="sim-${k}">${simDef[k].map((r, i) =>
    `<div class="sim-row"><select data-k="${k}" data-i="${i}">${opts(r.id)}</select><input type="number" min="1" max="500" value="${r.count}" data-k="${k}" data-i="${i}">
    ${simDef[k].length > 1 ? `<span class="calc-x" data-del="${k}:${i}">×</span>` : ""}</div>`).join("")}</div>
    ${simDef[k].length < 4 ? `<button class="calc-btn" data-add="${k}">+ unidad</button>` : ""}
    <div class="lab-row" style="margin-top:8px"><label>Civ<select data-civ="${k}:civ">${civOpts(simDef.civ[k])}</select></label>
      <label>Aliado (bonus de equipo)<select data-civ="${k}:ally">${civOpts(simDef.ally[k])}</select></label></div>
    <div class="lab-row" style="margin-top:8px"><label>Ataque +<input type="number" min="0" max="3" value="${simDef.up[k][0]}" data-up="${k}:0" style="width:54px"></label>
      <label>Arm. melee +<input type="number" min="0" max="3" value="${simDef.up[k][1]}" data-up="${k}:1" style="width:54px"></label>
      <label>Arm. perf. +<input type="number" min="0" max="3" value="${simDef.up[k][2]}" data-up="${k}:2" style="width:54px"></label></div></div>`;
  body.innerHTML = `<p class="lab-intro"><b>Simulador de combate</b> ejército vs ejército con stats y bonus del vault/árbol. <b>Es una aproximación</b>: sin hit&run ni selección de objetivo; aplica bonos de civ y de equipo (y descuentos de costo) según la edad, pero no techs únicas ni unidades únicas.
    Útil para comparar tendencias (¿cuántos Halberdiers por Paladín?), no para predecir una pelea exacta.</p>
    <div class="lab-grid two">${side("a", "Ejército A")}${side("b", "Ejército B")}</div>
    <div class="lab-panel calc-panel"><div class="lab-row"><label>Edad<select id="sim-age">${["Dark", "Feudal", "Castle", "Imperial"].map((n, i) => `<option value="${i}" ${i === simDef.age ? "selected" : ""}>${n}</option>`).join("")}</select></label>
      <label>Distancia inicial (casillas)<input type="number" id="sim-gap" min="1" max="30" value="10" style="width:70px"></label>
      <button class="calc-btn primary" id="sim-go">Simular</button></div><div id="sim-out" class="sim-res"></div></div>
    <div class="lab-panel calc-panel"><h3>Matriz de eficiencia de costo</h3><p class="lab-small">Usa las civs, aliados y edad elegidos arriba (fila = civ A, columna = civ B). Cada celda enfrenta a igual valor en recursos. Positivo (verde) = gana la unidad de la fila; negativo (rojo) = gana la de la columna; magnitud = valor sobrante del ganador / presupuesto.</p>
      <div class="lab-row"><label style="flex:1">Unidades<div id="mx-pick"></div></label><label>Presupuesto<input type="number" id="mx-bud" value="2000" step="500" min="500" style="width:80px"></label><button class="calc-btn primary" id="mx-go">Calcular</button></div>
      <div id="mx-out" class="mx-wrap"></div></div>`;
  $$("#view-lab [data-add]").forEach((b) => b.onclick = () => { simDef[b.dataset.add].push({ id: "knight", count: 10 }); sim(body); });
  $$("#view-lab [data-del]").forEach((b) => b.onclick = () => { const [k, i] = b.dataset.del.split(":"); simDef[k].splice(+i, 1); sim(body); });
  $$("#view-lab .sim-row select, #view-lab .sim-row input").forEach((el) => el.onchange = () => {
    const r = simDef[el.dataset.k][+el.dataset.i]; if (el.tagName === "SELECT") r.id = el.value; else r.count = Math.max(1, +el.value || 1); });
  $$("#view-lab [data-up]").forEach((el) => el.onchange = () => { const [k, i] = el.dataset.up.split(":"); simDef.up[k][+i] = Math.max(0, Math.min(3, +el.value || 0)); });
  $$("#view-lab [data-civ]").forEach((el) => el.onchange = () => { const [k, f] = el.dataset.civ.split(":"); simDef[f][k] = el.value; saveSim(); });
  $("#sim-age").onchange = (e) => { simDef.age = +e.target.value; saveSim(); };
  $("#sim-go").onclick = async () => {
    saveSim();
    const u = (k) => ({ attack: simDef.up[k][0], armMelee: simDef.up[k][1], armPierce: simDef.up[k][2] });
    const r = await fetch("/api/sim", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ a: simDef.a, b: simDef.b, gap: +$("#sim-gap").value, upgradesA: u("a"), upgradesB: u("b"),
        civA: simDef.civ.a, civB: simDef.civ.b, allyA: simDef.ally.a, allyB: simDef.ally.b, age: simDef.age }) }).then((x) => x.json());
    if (r.error) { $("#sim-out").textContent = r.error; return; }
    const tbl = (s, t) => `<table class="lab-table"><thead><tr><th>${t}</th><th>Inicio</th><th>Quedan</th></tr></thead><tbody>${s.rows.map((x) =>
      `<tr><td>${esc(x.name)}</td><td>${x.start}</td><td><b>${x.left}</b></td></tr>`).join("")}</tbody></table><div class="lab-small">Valor perdido: ${s.lostValue} de ${s.startValue}</div>`;
    $("#sim-out").innerHTML = `<p class="win">${r.winner === "draw" ? "Empate (sin ganador en 15 min)" : "Gana el ejército " + r.winner} <span class="lab-small">· ${r.seconds} s</span></p>
      <div class="lab-grid two"><div>${tbl(r.a, "A")}</div><div>${tbl(r.b, "B")}</div></div>
      <p>Eficiencia (valor enemigo destruido / valor propio perdido): A <b>${r.efficiency.a ?? "∞"}</b> · B <b>${r.efficiency.b ?? "∞"}</b></p>
      ${["a", "b"].map((k) => { const c = r.civs[k]; return (c.civ || c.ally) ? `<div class="lab-small"><b>Bonos aplicados ${k.toUpperCase()}</b> (${esc(civName(c.civ) || "—")}${c.ally ? " + equipo " + esc(civName(c.ally)) : ""}): ${c.applied.length ? esc(c.applied.join(" · ")) : "ninguno sobre estas unidades"}${c.warnings.length ? `<br>⚠️ ${esc(c.warnings.join(" · "))}` : ""}</div>` : ""; }).join("")}
      <p class="lab-src">Limitaciones: ${esc(r.caveats.join(" · "))}</p>`;
  };
  const picker = { sel: store.get("mx", ["halberdier", "paladin", "arbalester", "eliteskirm", "heavycamel", "champion"]) };
  const drawPick = () => {
    $("#mx-pick").innerHTML = `${picker.sel.map((id) => `<span class="lab-chip">${esc(SIM.find((u) => u.id === id)?.name || id)}<span class="x" data-x="${id}">×</span></span>`).join("")}
      ${picker.sel.length < 14 ? `<select id="mx-add"><option value="">+ unidad…</option>${SIM.filter((u) => !picker.sel.includes(u.id)).map((u) => `<option value="${u.id}">${esc(u.name)}</option>`).join("")}</select>` : ""}`;
    $("#mx-add")?.addEventListener("change", (e) => { if (e.target.value) { picker.sel.push(e.target.value); store.set("mx", picker.sel); drawPick(); } });
    $$("#mx-pick .x").forEach((x) => x.onclick = () => { picker.sel = picker.sel.filter((i) => i !== x.dataset.x); store.set("mx", picker.sel); drawPick(); });
  };
  drawPick();
  $("#mx-go").onclick = async () => {
    const m = await api(`/api/sim/matrix?units=${picker.sel.join(",")}&budget=${$("#mx-bud").value}&civA=${simDef.civ.a}&civB=${simDef.civ.b}&allyA=${simDef.ally.a}&allyB=${simDef.ally.b}&age=${simDef.age}`);
    if (m.error) { $("#mx-out").textContent = m.error; return; }
    const col = (v) => v === 0 ? "transparent" : v > 0 ? `rgba(61,107,23,${0.15 + v * 0.65})` : `rgba(155,43,26,${0.15 + -v * 0.65})`;
    $("#mx-out").innerHTML = `<table class="mx"><thead><tr><th></th>${m.names.map((n) => `<th class="col">${esc(n)}</th>`).join("")}</tr></thead><tbody>${m.cells.map((r, i) =>
      `<tr><th>${esc(m.names[i])}</th>${r.map((v, j) => `<td style="background:${col(v)}" title="${esc(m.names[i])} vs ${esc(m.names[j])}">${i === j ? "·" : v.toFixed(2)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  };
}

// ══ 7. COMPARADOR ════════════════════════════════════════════════════════
function compare(body) {
  body.innerHTML = `<p class="lab-intro"><b>Comparador civ vs civ:</b> perfil lado a lado y <b>solo lo que difiere</b> en sus árboles (se ignoran únicas y lo que ambas comparten).</p>
    <div class="lab-panel calc-panel"><div class="lab-row"><label>Civ A${civSelect("cp-a", store.get("cp-a", "franks"))}</label><label>Civ B${civSelect("cp-b", store.get("cp-b", "britons"))}</label></div></div><div id="cp-out"></div>`;
  const AX = ["Dark", "Feudal", "Castle", "Imperial", "Abierto", "Cerrado", "Agua", "Nómada"], CT = ["Infantería", "Caballería", "Arqueros", "Asedio", "Naval", "Monjes", "Defensa", "Pólvora"];
  const run = async () => {
    const a = $("#cp-a").value, b = $("#cp-b").value; store.set("cp-a", a); store.set("cp-b", b);
    if (!a || !b) return;
    const d = await api(`/api/compare?a=${a}&b=${b}`);
    if (d.error) { $("#cp-out").innerHTML = `<div class="lab-panel calc-panel">${esc(d.error)}</div>`; return; }
    const card = (c) => `<div class="lab-panel calc-panel"><h3 class="lab-hero">${esc(c.name)} <span class="lab-tag ${c.position}">${c.position}</span>${c.phosphor ? ` <span class="lab-tag ${c.phosphor}">FC ${c.phosphor}</span>` : ""}</h3>
      <div class="lab-small">${esc(c.specialty)}</div><p>🤝 ${esc(c.teamBonus || "—")}</p>
      <h4>Fortalezas</h4><ul>${c.strengths.map((x) => `<li>${esc(x)}</li>`).join("")}</ul><h4>Debilidades</h4><ul>${c.weaknesses.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>`;
    const bars = (la, lb, labels) => la && lb ? labels.map((l, i) => `<span>${l}</span><span class="b"><i style="width:${la[i] * 10}%"></i></span><span class="b r"><i style="width:${lb[i] * 10}%"></i></span>`).join("") : "<span class='lab-small'>sin radar</span>";
    const list = (arr, n) => `<div class="lab-panel calc-panel"><h3>Solo ${esc(n)} <span class="lab-small">(${arr.length})</span></h3><div class="cmp-diff">${arr.map((x) =>
      `<div>${x.imgPath ? `<img src="/tree/${x.imgPath}" alt="">` : ""} ${esc(x.name)} <span class="lab-small">${x.kind === "tech" ? "tech" : x.kind}</span></div>`).join("") || "—"}</div></div>`;
    $("#cp-out").innerHTML = `<div class="lab-grid two">${card(d.a)}${card(d.b)}</div>
      <div class="lab-panel calc-panel"><h3>Radar <span class="lab-small">· <span class="cmp-key"></span>${esc(d.a.name)} <span class="cmp-key r"></span>${esc(d.b.name)}</span></h3>
        <div class="lab-grid two"><div class="cmp-bars">${bars(d.a.phase, d.b.phase, AX)}</div><div class="cmp-bars">${bars(d.a.category, d.b.category, CT)}</div></div></div>
      <div class="lab-grid two">${list(d.onlyA, d.a.name)}${list(d.onlyB, d.b.name)}</div><p class="lab-small">${esc(d.note)} Comparten ${d.shared} elementos.</p>`;
  };
  $("#cp-a").onchange = run; $("#cp-b").onchange = run; run();
}

// ══ 8. ESTUDIO (repetición espaciada, Leitner) ═══════════════════════════
const BOX_DAYS = [0, 1, 3, 7, 14, 30];
async function study(body) {
  const { cards } = await get("/api/quiz");
  const prog = store.get("study", {});
  const now = Date.now(), day = 864e5;
  const due = cards.filter((c) => !prog[c.id] || prog[c.id].due <= now);
  const stat = { nuevas: cards.filter((c) => !prog[c.id]).length, aprendiendo: cards.filter((c) => prog[c.id] && prog[c.id].box < 4).length, dominadas: cards.filter((c) => prog[c.id]?.box >= 4).length };
  body.innerHTML = `<p class="lab-intro"><b>Modo estudio:</b> tarjetas generadas desde el vault (bonus de equipo, especialidad, posición, Phosphor) con repetición espaciada (cajas de Leitner).
    Las que fallás vuelven antes; el progreso queda en este navegador.</p>
    <div class="lab-panel calc-panel"><div class="lab-small">Nuevas ${stat.nuevas} · Aprendiendo ${stat.aprendiendo} · Dominadas ${stat.dominadas} · Para hoy ${due.length}
      · <a href="#" id="st-reset">reiniciar progreso</a></div><div id="st-card"></div></div>`;
  $("#st-reset").onclick = (e) => { e.preventDefault(); store.set("study", {}); study(body); };
  const pick = () => due.length ? due[Math.floor(Math.random() * due.length)] : null;
  const draw = () => {
    const c = pick(); const el = $("#st-card");
    if (!c) { el.innerHTML = `<p class="st-q">✔ No quedan tarjetas pendientes por hoy.</p>`; return; }
    const pool = [...new Set(cards.filter((x) => x.type === c.type && x.a !== c.a).map((x) => x.a))];
    const opts = (c.fixed || [c.a, ...pool.sort(() => Math.random() - .5).slice(0, 3)]).slice().sort(() => Math.random() - .5);
    el.innerHTML = `<div class="st-q">${esc(c.q)}</div>${opts.map((o) => `<button class="st-opt" data-o="${esc(o)}">${esc(o)}</button>`).join("")}<div class="lab-src">${esc(c.source)}</div>`;
    $$(".st-opt", el).forEach((b) => b.onclick = () => {
      const ok = b.dataset.o === c.a;
      $$(".st-opt", el).forEach((x) => { x.disabled = true; if (x.dataset.o === c.a) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      const p = prog[c.id] || { box: 0 };
      p.box = ok ? Math.min(5, p.box + 1) : 0; p.due = Date.now() + BOX_DAYS[p.box] * day + (ok ? 0 : 0);
      prog[c.id] = p; store.set("study", prog);
      const i = due.findIndex((x) => x.id === c.id); if (i >= 0) due.splice(i, 1);
      el.insertAdjacentHTML("beforeend", `<p>${ok ? "✔ Correcto" : "✖ Era: <b>" + esc(c.a) + "</b>"} · ${due.length} pendientes <button class="calc-btn primary" id="st-next">Siguiente</button></p>`);
      $("#st-next").onclick = draw;
    });
  };
  draw();
}

// ══ 9. GUÍAS POR MAPA ════════════════════════════════════════════════════
// Markdown mínimo y seguro (se escapa todo antes de dar formato): párrafos, ###, listas, tablas y wikilinks.
function mdInline(s, ctx) {
  const t = esc(s.replace(/\\\|/g, "|"));
  return t
    .replace(/\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => {
      const label = alias || target.split("/").pop();
      const [kind, ...rest] = target.split("/");
      const id = rest.join("/");
      if (kind === "maps") { const slug = slugOf(id); if (ctx.maps[slug]) return `<a href="#" data-map="${slug}">${label}</a>`; }
      if (kind === "strategies" && ctx.builds.has(id)) return `<a href="#" data-build="${id}">${label}</a>`;
      return label;
    })
    .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<i>$2</i>");
}
const slugOf = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
function mdBlock(md, ctx) {
  const lines = md.split("\n"), out = [];
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!l.trim()) continue;
    if (/^### /.test(l)) { out.push(`<h4>${mdInline(l.slice(4), ctx)}</h4>`); continue; }
    if (/^\|/.test(l)) {
      const rows = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i]); i++; } i--;
      const cell = (r) => r.trim().replace(/^\||\|$/g, "").split(/(?<!\\)\|/);
      const [head, , ...body] = rows;
      out.push(`<table class="lab-table"><thead><tr>${cell(head).map((c) => `<th>${mdInline(c.trim(), ctx)}</th>`).join("")}</tr></thead><tbody>${body.map((r) =>
        `<tr>${cell(r).map((c) => `<td>${mdInline(c.trim(), ctx)}</td>`).join("")}</tr>`).join("")}</tbody></table>`);
      continue;
    }
    if (/^\s*([-*]|\d+\.) /.test(l)) {
      const ordered = /^\s*\d+\. /.test(l), items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.) /.test(lines[i])) { items.push(lines[i].replace(/^\s*([-*]|\d+\.) /, "")); i++; } i--;
      out.push(`<${ordered ? "ol" : "ul"}>${items.map((x) => `<li>${mdInline(x, ctx)}</li>`).join("")}</${ordered ? "ol" : "ul"}>`);
      continue;
    }
    const para = [l]; while (i + 1 < lines.length && lines[i + 1].trim() && !/^(###|\||\s*([-*]|\d+\.) )/.test(lines[i + 1])) para.push(lines[++i]);
    out.push(`<p>${mdInline(para.join(" "), ctx)}</p>`);
  }
  return out.join("");
}
const AXIS_DRAFT = { open: "open", closed: "closed", water: "water", nomad: "nomad" };
async function maps(body) {
  const { maps: M } = await get("/api/maps");
  const bySlug = Object.fromEntries(M.map((m) => [m.slug, m.name]));
  let filter = store.get("map-filter", "all"), q = "";
  const types = [["all", "Todos"], ["abierto", "Abiertos"], ["semiabierto", "Semiabiertos"], ["cerrado", "Cerrados"], ["hibrido", "Híbridos"], ["agua", "Agua"], ["nomada", "Nómadas"], ["caotico", "Caóticos"]];
  body.innerHTML = `<p class="lab-intro"><b>Guías por mapa:</b> generación y recursos, cómo se juega, civs que destacan (de la wiki) y las civs mejor puntuadas por el radar para ese <b>tipo</b> de mapa.
    Desde cada guía saltás al draft, al scouting o al build order recomendado.</p>
    <div id="mp-list"><div class="lab-panel calc-panel"><div class="lab-row"><label>Buscar<input id="mp-q" placeholder="Arabia, Arena, Nomad…" size="18"></label>
      <div id="mp-types" style="display:flex;flex-wrap:wrap;gap:6px">${types.map(([k, l]) => `<button class="calc-btn" data-t="${k}">${l}</button>`).join("")}</div></div>
      <div id="mp-grid" class="lab-grid"></div></div></div><div id="mp-detail"></div>`;
  const drawList = () => {
    $$("#mp-types .calc-btn").forEach((b) => b.classList.toggle("active", b.dataset.t === filter));
    const rows = M.filter((m) => (filter === "all" || m.type === filter) && (!q || (m.name + " " + (m.strategies || "")).toLowerCase().includes(q)));
    $("#mp-grid").innerHTML = rows.map((m) => `<a class="mp-card" data-slug="${m.slug}"><b>${esc(m.name)}</b> <span class="lab-tag mt-${m.type}">${esc(m.typeLabel || "—")}</span>
      <div class="lab-small">${esc(m.quote.length > 150 ? m.quote.slice(0, 147) + "…" : m.quote)}</div></a>`).join("") || `<p class="lab-small">Sin resultados.</p>`;
    $$(".mp-card").forEach((c) => c.onclick = () => openMap(c.dataset.slug));
  };
  $$("#mp-types .calc-btn").forEach((b) => b.onclick = () => { filter = b.dataset.t; store.set("map-filter", filter); drawList(); });
  $("#mp-q").oninput = (e) => { q = e.target.value.trim().toLowerCase(); drawList(); };
  const openMap = async (slug) => {
    store.set("map", slug);
    const m = await api(`/api/maps/${slug}`);
    $("#mp-list").style.display = "none";
    const ctx = { maps: bySlug, builds: new Set(m.builds.map((b) => b.id)) };
    const facts = Object.entries(m.data || {}).map(([k, v]) => `<span class="lab-chip"><b>${esc(k)}:</b>&nbsp;${esc(v)}</span>`).join("");
    const secOpen = (i, t) => i < 2 || /c[oó]mo se juega|estrategias/i.test(t);
    $("#mp-detail").innerHTML = `<div class="lab-panel calc-panel"><div class="lab-row"><button class="calc-btn" id="mp-back">◀ Todos los mapas</button></div>
      <h3 class="lab-hero">${esc(m.name)} <span class="lab-tag mt-${m.type}">${esc(m.typeLabel || "")}</span></h3>
      <p>${esc(m.quote)}</p>${m.strategies ? `<p class="lab-small"><b>Estrategias típicas:</b> ${esc(m.strategies)}</p>` : ""}<div class="mp-facts">${facts}</div>
      <div class="lab-row" style="margin-top:12px">
        <button class="calc-btn primary" id="mp-draft" ${m.axis ? "" : "disabled title='sin eje de radar equivalente para este tipo'"}>⚖️ Draft en este mapa</button>
        <button class="calc-btn" id="mp-scout">🔭 Scouting</button>
        ${m.builds.map((b) => `<button class="calc-btn" data-build="${b.id}">🗒️ ${esc(b.title)}</button>`).join("")}</div>
      ${m.relatedMaps.length ? `<div class="lab-small">Relacionados: ${m.relatedMaps.map((r) => `<a href="#" data-map="${r.slug}">${esc(r.name)}</a>`).join(" · ")}</div>` : ""}</div>
      <div class="lab-grid two"><div>${m.sections.map((s, i) => `<details class="lab-panel calc-panel mp-sec" ${secOpen(i, s.title) ? "open" : ""}><summary><b>${esc(s.title)}</b></summary>${mdBlock(s.md, ctx)}</details>`).join("")}</div>
        <div>${m.highlights.length ? `<div class="lab-panel calc-panel"><h3>Civs que destacan <span class="lab-small">(wiki)</span></h3>${m.highlights.map((h) =>
          `<div style="margin:6px 0"><span class="lab-small">${h.negative ? "⚠️ " : ""}${esc(h.profile)}</span><div>${h.civs.map((c, i) => `<span class="lab-chip ${h.negative ? "no" : ""} mp-civ" data-civ="${h.slugs[i] || ""}">${esc(c)}</span>`).join("")}</div></div>`).join("")}</div>` : ""}
          ${m.radarTop ? `<div class="lab-panel calc-panel"><h3>Según el radar <span class="lab-small">(${esc(m.radarTop.basis)})</span></h3>
            <div class="lab-small">Mejor puntuadas para este tipo de mapa</div><div>${m.radarTop.top.map((c) => `<span class="lab-chip mp-civ" data-civ="${c.slug}">${esc(c.name)} ${c.score}</span>`).join("")}</div>
            <div class="lab-small" style="margin-top:6px">Peor puntuadas</div><div>${m.radarTop.bottom.map((c) => `<span class="lab-chip no mp-civ" data-civ="${c.slug}">${esc(c.name)} ${c.score}</span>`).join("")}</div>
            <p class="lab-src">El radar califica por tipo de mapa, no por este mapa en particular. Clic en una civ para compararla.</p></div>` : `<div class="lab-panel calc-panel lab-small">Este tipo de mapa no tiene un eje equivalente en el radar de civs.</div>`}
          <p class="lab-src">Fuente: <code>${esc(m.note)}</code></p></div></div>`;
    $("#mp-back").onclick = () => { $("#mp-detail").innerHTML = ""; $("#mp-list").style.display = ""; store.set("map", ""); };
    $("#mp-draft").onclick = () => { if (m.axis) { store.set("dv-map", AXIS_DRAFT[m.axis]); openTab("draft"); } };
    $("#mp-scout").onclick = () => openTab("scouting");
    $$("#mp-detail [data-build]").forEach((a) => a.onclick = (e) => { e.preventDefault(); store.set("bo", a.dataset.build); openTab("builds"); });
    $$("#mp-detail [data-map]").forEach((a) => a.onclick = (e) => { e.preventDefault(); openMap(a.dataset.map); window.scrollTo(0, 0); });
    $$("#mp-detail .mp-civ").forEach((c) => { if (c.dataset.civ) c.onclick = () => { store.set("cp-a", c.dataset.civ); openTab("compare"); }; });
    window.scrollTo(0, 0);
  };
  drawList();
  const last = store.get("map", ""); if (last && bySlug[last]) openMap(last);
}

// ── Ventana de overlay aparte (?lab=overlay&bo=<id>) ─────────────────────
window.addEventListener("DOMContentLoaded", () => {
  if (new URLSearchParams(location.search).get("lab") !== "overlay") return;
  document.body.classList.add("lab-ovl-only");
  tab = "builds"; initLab().then(() => { const o = $("#bo-overlay"); o.classList.add("on"); document.body.appendChild(o); });
});
})();
