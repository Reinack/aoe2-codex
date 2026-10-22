"""Dashboard Streamlit — analítica de red del grafo de conocimiento AoE2.

    streamlit run codex_analytics/app.py
"""

from __future__ import annotations

import tempfile

import networkx as nx
import streamlit as st
from pyvis.network import Network

from codex_analytics import metrics
from codex_analytics.loader import load_graph, load_ratings

st.set_page_config(page_title="AoE2 Codex — Analítica", layout="wide")

# Paleta por tipo de nodo
TYPE_COLOR = {
    "civs": "#e8b84b", "strategies": "#6baed6", "players": "#d6616b",
    "technologies": "#74c476", "units": "#9e9ac8", "buildings": "#fd8d3c",
    "maps": "#8c6d31", "matchups": "#e377c2", "meta": "#a0a0a0",
    "counters": "#17becf", "replays-analysis": "#bcbd22",
}


@st.cache_resource(show_spinner="Cargando grafo desde Neo4j…")
def get_graph() -> nx.DiGraph:
    return load_graph()


@st.cache_data(show_spinner=False)
def get_ratings():
    return load_ratings()


def render_subgraph(g: nx.DiGraph, center: str, radius: int = 1) -> str:
    """Renderiza la vecindad de un nodo con pyvis y devuelve el HTML."""
    nodes = {center} | set(nx.single_source_shortest_path_length(
        g.to_undirected(), center, cutoff=radius).keys())
    sub = g.subgraph(nodes)
    net = Network(height="560px", width="100%", bgcolor="#111418",
                  font_color="#e6e6e6", directed=True)
    net.barnes_hut(spring_length=120)
    for n in sub.nodes:
        t = g.nodes[n].get("type", "unknown")
        net.add_node(
            n, label=g.nodes[n].get("title", n),
            color="#ffffff" if n == center else TYPE_COLOR.get(t, "#888"),
            size=26 if n == center else 14, title=f"{t} · {n}",
        )
    for a, b in sub.edges:
        net.add_edge(a, b, color="#33383f")
    with tempfile.NamedTemporaryFile("w", suffix=".html", delete=False,
                                     encoding="utf-8") as f:
        net.write_html(f.name, notebook=False)
        return open(f.name, encoding="utf-8").read()


# --------------------------------------------------------------------------- #
g = get_graph()
ov = metrics.overview(g)

st.title("⚔️ AoE2 Strategy Codex — Analítica de red")
st.caption(
    "Grafo de conocimiento extraído de un vault Obsidian de ~700 notas. "
    "Métricas computadas con NetworkX sobre las aristas de wikilink."
)

c1, c2, c3, c4, c5 = st.columns(5)
c1.metric("Notas", ov["nodos"])
c2.metric("Enlaces", ov["aristas"])
c3.metric("Densidad", f"{ov['densidad']:.4f}")
c4.metric("Grado medio", f"{ov['grado_medio']:.1f}")
c5.metric("Componentes", ov["componentes"])

tabs = st.tabs(
    ["🏆 Influencia", "❓ Preguntas del meta", "🧩 Comunidades",
     "🕳️ Aislados", "📊 Tier-lists", "🔍 Explorar nodo"]
)

with tabs[0]:
    st.subheader("Centralidad")
    col_a, col_b = st.columns(2)
    types = ["(todos)"] + sorted({d["type"] for _, d in g.nodes(data=True)})
    sel = col_a.selectbox("Filtrar PageRank por tipo", types)
    tf = None if sel == "(todos)" else sel
    col_a.dataframe(metrics.pagerank(g, top=25, type_filter=tf),
                    width='stretch', hide_index=True)
    col_b.markdown("**Nodos puente** (betweenness) — conectan zonas del saber")
    col_b.dataframe(metrics.betweenness(g, top=25),
                    width='stretch', hide_index=True)

with tabs[1]:
    st.subheader("Preguntas que el grafo ahora responde")
    col_a, col_b = st.columns(2)
    col_a.markdown("**¿Qué unidades aparecen en más estrategias?**")
    col_a.dataframe(metrics.units_in_strategies(g),
                    width='stretch', hide_index=True)
    col_a.markdown("**¿Qué jugadores influyen más en el meta?**")
    col_a.dataframe(metrics.player_influence(g),
                    width='stretch', hide_index=True)
    col_b.markdown("**¿Qué tecnologías conectan más civilizaciones?**")
    col_b.dataframe(metrics.techs_connecting_civs(g),
                    width='stretch', hide_index=True)

with tabs[2]:
    st.subheader("Comunidades (Louvain)")
    st.caption("Clústeres temáticos emergentes — el algoritmo agrupa por "
               "densidad de enlaces, sin saber de qué trata cada nota.")
    st.dataframe(metrics.communities(g), width='stretch', hide_index=True)

with tabs[3]:
    iso = metrics.isolated(g)
    st.subheader(f"Conocimiento aislado — {len(iso)} notas sin enlaces entrantes")
    st.caption("Saber que nadie referencia: candidatos a cross-linkear o a podar.")
    st.dataframe(iso, width='stretch', hide_index=True)

with tabs[4]:
    st.subheader("Valoraciones de civs por tier-list")
    ratings = get_ratings()
    if ratings:
        import pandas as pd
        df = pd.DataFrame(ratings)
        pivot = df.pivot_table(index="civ", columns="lista", values="tier",
                               aggfunc="first")
        st.dataframe(pivot, width='stretch')
    else:
        st.info("Sin valoraciones en el grafo.")

with tabs[5]:
    st.subheader("Explorar la vecindad de una nota")
    options = sorted(g.nodes, key=lambda n: g.nodes[n].get("title", n))
    labels = {n: f"{g.nodes[n].get('title', n)}  ({g.nodes[n].get('type')})"
              for n in options}
    default = "civs/Georgians.md" if g.has_node("civs/Georgians.md") else options[0]
    center = st.selectbox("Nota central", options,
                          index=options.index(default),
                          format_func=lambda n: labels[n])
    radius = st.slider("Radio (saltos)", 1, 2, 1)
    st.components.v1.html(render_subgraph(g, center, radius), height=580, scrolling=True)
