// codex-bridge.js — cablea el tech-tree visual al grafo de conocimiento del codex.
//
// Envuelve showStatsPanel(ev, n) (definido en stats-panel.js): cuando el usuario
// hace click en una unidad/tech/edificio, además de los stats locales del árbol,
// consulta /api/tree/:tree_id y muestra lo que vive en el grafo Neo4j:
//   - si el dato fue corregido por el parche (badge),
//   - el acceso por civilizaciones (aristas HAS_UNIT/HAS_TECH/HAS_BUILDING),
//   - el extracto de prosa de la nota del vault (conocimiento real),
//   - un botón para preguntarle al GraphRAG local sobre esa entidad.
//
// El árbol deja de ser un visual aislado: es la puerta de entrada al grafo.

(function () {
  const box = () => document.getElementById("sp-codex");

  function wrap() {
    if (typeof window.showStatsPanel !== "function") return false;
    if (window.showStatsPanel.__codexWrapped) return true;
    const orig = window.showStatsPanel;
    const wrapped = function (ev, n) {
      orig.apply(this, arguments);
      try { loadCodex(n && n.id); } catch (e) { /* no romper el panel del árbol */ }
    };
    wrapped.__codexWrapped = true;
    window.showStatsPanel = wrapped;
    return true;
  }
  // Los scripts son `defer` → showStatsPanel ya existe; reintento por las dudas.
  if (!wrap()) {
    let tries = 0;
    const t = setInterval(() => { if (wrap() || ++tries > 50) clearInterval(t); }, 50);
  }

  async function loadCodex(treeId) {
    const el = box();
    if (!el) return;
    if (!treeId) { el.innerHTML = ""; return; }
    el.innerHTML = `<div class="cx-head">📖 Codex</div><div class="cx-loading">consultando el grafo…</div>`;
    let data;
    try {
      const r = await fetch(`/api/tree/${encodeURIComponent(treeId)}`);
      if (r.status === 404) { el.innerHTML = `<div class="cx-head">📖 Codex</div><div class="cx-muted">Sin entidad en el grafo para <code>${treeId}</code>.</div>`; return; }
      data = await r.json();
    } catch (e) {
      el.innerHTML = `<div class="cx-head">📖 Codex</div><div class="cx-muted">API del codex no disponible.</div>`;
      return;
    }
    render(el, data);
  }

  function render(el, d) {
    const civ = d.civAccess || { count: 0, civs: [] };
    const civSample = civ.civs.slice(0, 8).join(", ") + (civ.count > 8 ? ` +${civ.count - 8} más` : "");
    const patchBadge = d.patched
      ? `<span class="cx-badge cx-patch" title="Valor corregido por ${d.patched}: el vault (post-parche) gana sobre el árbol (pre-parche)">⚠ corregido por ${d.patched}</span>`
      : "";
    const docBadge = d.documented
      ? `<span class="cx-badge cx-ok">✓ documentada en el vault</span>`
      : `<span class="cx-badge cx-muted-badge">solo datos de juego</span>`;

    let html = `<div class="cx-head">📖 Codex <span class="cx-label">${d.label || ""}</span></div>`;
    html += `<div class="cx-badges">${docBadge}${patchBadge}</div>`;

    // Números que viven en el grafo (Fix 5). Para entidades parcheadas, son los
    // valores post-parche del vault (pueden diferir del panel nativo del árbol).
    const s = d.stats || {};
    const cost = ["food", "wood", "gold", "stone"]
      .filter((r) => s["cost_" + r] != null)
      .map((r) => `${s["cost_" + r]} ${({ food: "🍖", wood: "🪵", gold: "🪙", stone: "🪨" })[r]}`)
      .join("  ");
    const combat = [s.hp != null ? `${s.hp} PV` : "", s.attack != null ? `${s.attack} atq` : ""].filter(Boolean).join(" · ");
    if (cost || combat) {
      html += `<div class="cx-graphstats">⛓ grafo: ${cost ? `<b>${cost}</b>` : ""}${cost && combat ? "  ·  " : ""}${combat}</div>`;
    }

    if (civ.count) {
      html += `<div class="cx-civ"><b>${civ.count}</b> civ${civ.count === 1 ? "" : "s"} con acceso: <span class="cx-civ-list">${civSample}</span></div>`;
    }
    if (d.note && d.note.excerpt) {
      html += `<div class="cx-excerpt">${escapeHtml(d.note.excerpt)}</div>`;
      html += `<a class="cx-link" href="/?path=${encodeURIComponent(d.note.path)}" target="_blank">Abrir nota en el explorador ↗</a>`;
    }
    html += `<button class="cx-ask" data-q="${escapeAttr("Háblame de " + (d.title || "") + " en AoE2: para qué sirve y cómo se usa.")}">🤖 Preguntar al Codex (GraphRAG)</button>`;
    html += `<div class="cx-answer" style="display:none"></div>`;
    el.innerHTML = html;

    const btn = el.querySelector(".cx-ask");
    if (btn) btn.addEventListener("click", () => askCodex(btn, el.querySelector(".cx-answer")));
  }

  async function askCodex(btn, out) {
    const q = btn.getAttribute("data-q");
    btn.disabled = true;
    out.style.display = "block";
    out.innerHTML = `<span class="cx-loading">el modelo local está pensando… (puede tardar)</span>`;
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await r.json();
      const text = data.text || data.answer;
      if (text) {
        out.innerHTML = `<div class="cx-answer-text">${escapeHtml(text)}</div>`;
        if (data.abstained) out.innerHTML += `<div class="cx-sources">(el modelo se abstuvo: poca evidencia en el grafo)</div>`;
        const srcs = (data.sources || []).map((s) => (typeof s === "string" ? s : (s.title || s.path || String(s))));
        if (srcs.length) out.innerHTML += `<div class="cx-sources">Fuentes: ${srcs.slice(0, 5).map(escapeHtml).join(" · ")}</div>`;
      } else {
        out.innerHTML = `<span class="cx-muted">${escapeHtml(data.error || "sin respuesta")}</span>`;
      }
    } catch (e) {
      out.innerHTML = `<span class="cx-muted">error consultando el GraphRAG</span>`;
    } finally {
      btn.disabled = false;
    }
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }
  function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }
})();
