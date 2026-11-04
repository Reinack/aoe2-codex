/* Matchups: secciones que el servidor ya devolvía pero la vista no mostraba (Phosphor, fortalezas, huecos,
 * counter-play, partidas documentadas) + lo que antes vivía en el Lab como "Comparar civs" (radar y diferencias de árbol).
 * Un solo lugar para el cruce civ vs civ. renderMatchupExtra(d) lo llama renderMatchup() de index.html.
 * Los accesos a Draft, Scouting y guías de mapa salen de acá hacia el Lab (window.Lab). */
(() => {
  const AX = ["Dark", "Feudal", "Castle", "Imperial", "Abierto", "Cerrado", "Agua", "Nómada"];
  const CT = ["Infantería", "Caballería", "Arqueros", "Asedio", "Naval", "Monjes", "Defensa", "Pólvora"];
  const sec = (cls, title, body) => `<div class="mu-section ${cls}"><h3>${title}</h3>${body}</div>`;
  const bullets = (arr) => (arr?.length ? `<ul class="mu-list">${arr.map((x) => `<li>${esc(typeof x === "string" ? x : x.text || "")}</li>`).join("")}</ul>` : "");
  const who = (c) => `${GK.emb(c.slug, "emb-m")}<b>${esc(c.title)}</b>`;

  // ── Datos del propio /api/matchup ─────────────────────────────────────────
  const phosphor = (d) => {
    const row = (civ, p) => (p ? `<div>${GK.emb(civ.slug, "emb-m")}<b>${esc(civ.title)}</b> <span class="lab-tag ${esc(p.tier)}">${esc(p.tier)}</span> ${esc(p.uu || "")} <span class="mu-empty">(${esc(p.strength || "")})</span></div>` : "");
    const a = row(d.me, d.phosphorRush?.me), b = row(d.vs, d.phosphorRush?.vs);
    return a || b ? sec("wide", "🔥 Phosphor Rush · Fast Castle all-in en Arabia", `${a}${b}<div class="mu-empty">Tier según Red Fosforu. Si el rival es S o A, mirá el scouting antes del minuto 9.</div>`) : "";
  };
  const traits = (d) => {
    const one = (civ, t) => sec("", `${who(civ)} · fortalezas y debilidades`,
      `${t?.strengths?.length ? `<ul class="mu-list ok">${t.strengths.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
       ${t?.weaknesses?.length ? `<ul class="mu-list no">${t.weaknesses.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : `<span class="mu-empty">sin datos</span>`}`);
    return one(d.me, d.traits?.me) + one(d.vs, d.traits?.vs);
  };
  const missing = (d) => {
    const m = d.missing || {};
    const me = (m.me || []).map((x) => `<li><b>${esc(x.unit)}:</b> ${esc(x.self)}</li>`).join("");
    const vs = (m.vs || []).map((x) => `<li><b>${esc(x.unit)}:</b> ${esc(x.opp)}</li>`).join("");
    return (me ? sec("", "Tus huecos de árbol", `<ul class="mu-list no">${me}</ul>`) : "") + (vs ? sec("", `Huecos del rival que podés explotar`, `<ul class="mu-list ok">${vs}</ul>`) : "");
  };
  const counterPlay = (d) =>
    (d.counterPlay?.vs?.length ? sec("wide", `Cómo jugar contra ${esc(d.vs.title)}`, bullets(d.counterPlay.vs)) : "") +
    (d.counterPlay?.me?.length ? sec("wide", `Lo que hará ${esc(d.vs.title)} contra vos`, bullets(d.counterPlay.me)) : "");
  const documented = (d) => {
    const all = [...(d.documentedMatchups?.me || []).map((e) => ({ ...e, owner: d.me })), ...(d.documentedMatchups?.vs || []).map((e) => ({ ...e, owner: d.vs }))];
    if (!all.length) return "";
    return sec("wide", "Partidas documentadas de este cruce", all.map((e) => `<details class="mu-doc"><summary>${GK.emb(e.owner.slug, "emb-s")}<b>${esc(e.owner.title)}</b> · ${esc(e.heading)}</summary>
      ${bullets(e.bullets)}${e.recordar ? `<p class="mu-empty"><b>Para recordar:</b> ${esc(e.recordar)}</p>` : ""}</details>`).join(""));
  };

  // ── Antes "Comparar civs" del Lab: radar y diferencias de árbol ────────────
  const bars = (la, lb, labels) => (la && lb ? labels.map((l, i) => `<span>${l}</span><span class="b"><i style="width:${la[i] * 10}%"></i></span><span class="b r"><i style="width:${lb[i] * 10}%"></i></span>`).join("") : `<span class="mu-empty">sin radar</span>`);
  const diffList = (arr) => `<div class="cmp-diff">${arr.map((x) => `<div>${GK.ico(x.id, "ico-s")}${esc(x.name)} <span class="mu-empty">${x.kind === "tech" ? "tech" : x.kind === "unit" ? "unidad" : "edificio"}</span></div>`).join("") || "—"}</div>`;
  const compare = (d, c) => {
    if (!c || c.error) return "";
    return sec("wide", `Radar · <span class="cmp-key"></span>${esc(d.me.title)} <span class="cmp-key r"></span>${esc(d.vs.title)}`,
        `<div class="lab-grid two"><div class="cmp-bars">${bars(c.a.phase, c.b.phase, AX)}</div><div class="cmp-bars">${bars(c.a.category, c.b.category, CT)}</div></div>`)
      + sec("", `Solo ${esc(d.me.title)} (${c.onlyA.length})`, diffList(c.onlyA)) + sec("", `Solo ${esc(d.vs.title)} (${c.onlyB.length})`, diffList(c.onlyB))
      + `<div class="mu-empty wide" style="grid-column:1/-1">Árbol: solo lo que difiere (sin únicas ni lo que ambas comparten); comparten ${c.shared} elementos.</div>`;
  };

  // ── Accesos al Lab ────────────────────────────────────────────────────────
  const actions = (d, map) => sec("wide", "Seguir en el Lab", `<div class="lab-row">
      <button class="calc-btn" data-mx="draft">⚖️ Draft contra ${esc(d.vs.title)}</button>
      <button class="calc-btn" data-mx="scouting">🔭 Scouting: qué mirar y cómo responder</button>
      <button class="calc-btn" data-mx="sim">🧪 Simular</button>
      ${map ? `<button class="calc-btn" data-mx="map">🗺️ Guía de ${esc(map.name)}</button>` : ""}</div>`);

  let MAPS = null;
  const loadMaps = () => (MAPS ||= fetch("/api/maps").then((r) => r.json()).then((j) => j.maps).catch(() => []));
  loadMaps().then((maps) => {                                    // el campo "Mapa" autocompleta con las guías
    const inp = document.getElementById("mu-map"); if (!inp) return;
    inp.setAttribute("list", "mu-maps");
    inp.insertAdjacentHTML("afterend", `<datalist id="mu-maps">${maps.map((m) => `<option value="${esc(m.name)}">`).join("")}</datalist>`);
  });

  window.renderMatchupExtra = async (d) => {
    const out = document.getElementById("mu-result"); if (!out) return;
    const mapText = (document.getElementById("mu-map")?.value || "").trim().toLowerCase();
    const map = mapText ? (await loadMaps()).find((m) => m.name.toLowerCase() === mapText || m.slug === mapText) : null;
    out.insertAdjacentHTML("beforeend", phosphor(d) + counterPlay(d) + traits(d) + missing(d) + documented(d) + `<div id="mu-compare" class="mu-extra-slot" style="display:contents"></div>` + actions(d, map));
    $act(out, d, map);
    const c = await fetch(`/api/compare?a=${encodeURIComponent(d.me.slug)}&b=${encodeURIComponent(d.vs.slug)}`).then((r) => r.json()).catch(() => null);
    const slot = document.getElementById("mu-compare");
    if (slot && document.getElementById("mu-result") === out) slot.innerHTML = compare(d, c);
  };
  function $act(out, d, map) {
    out.querySelectorAll("[data-mx]").forEach((b) => b.onclick = () => {
      const k = b.dataset.mx;
      if (k === "draft") window.Lab.open("draft", { rivals: [d.vs.slug] });
      else if (k === "map") window.Lab.open("maps", { map: map.slug });
      else window.Lab.open(k);
    });
  }
})();
