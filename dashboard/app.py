"""Dashboard de analítica de red del AoE2 Strategy Codex (Streamlit).

Ejecutar:  streamlit run dashboard/app.py
Requiere Neo4j corriendo y el vault ya sincronizado (python -m codex.sync).
"""

from __future__ import annotations

import pandas as pd
import streamlit as st
from pyvis.network import Network

from codex import analytics as A
from codex.config import Config

st.set_page_config(page_title="AoE2 Strategy Codex", layout="wide", page_icon="🏰")

# Paleta por tipo de nota (consistente en tablas y grafo)
TYPE_COLOR = {
    "civs": "#e8b84b", "strategies": "#6baed6", "units": "#9e6bd6",
    "technologies": "#6bd6a0", "buildings": "#d67b6b", "players": "#d66ba8",
    "maps": "#8ab06b", "meta": "#b0b06b", "matchups": "#d6a36b",
    "counters": "#6bd6d6", "replays-analysis": "#a0a0d6", "resources": "#c0c0c0",
    "root": "#888888",
}


@st.cache_resource
def get_config() -> Config:
    return Config.load()


@st.cache_resource(show_spinner="Cargando grafo desde Neo4j…")
def get_graph():
    return A.load_digraph(get_config())


@st.cache_resource(show_spinner="Calculando métricas de red…")
def get_metrics():
    g = get_graph()
    return {
        "pagerank": A.top_pagerank(g, 25),
        "betweenness": A.top_betweenness(g, 25),
        "in_degree": A.top_in_degree(g, 25),
        "communities": A.communities(g),
        "isolation": A.isolation_report(g),
    }


@st.cache_data(show_spinner=False)
def get_semantic():
    return A.semantic_aggregations(get_config())


@st.cache_data(show_spinner=False)
def get_tiers():
    return A.tier_distribution(get_config())


def render_graph(subg, height: int = 600) -> str:
    net = Network(height=f"{height}px", width="100%", directed=True, bgcolor="#1a1a1a",
                  font_color="#eaeaea")
    net.barnes_hut(spring_length=120)
    for node, data in subg.nodes(data=True):
        t = data.get("type", "?")
        net.add_node(
            node, label=data.get("title", node),
            color=TYPE_COLOR.get(t, "#cccccc"), title=f"{data.get('title', node)} ({t})",
            size=12 + 2 * subg.degree(node),
        )
    for a, b in subg.edges():
        net.add_edge(a, b, color="#444444")
    return net.generate_html(notebook=False)


# --------------------------------------------------------------------------- #
st.title("🏰 AoE2 Strategy Codex — Analítica de red")
st.caption("Grafo de conocimiento de un vault Obsidian de ~700 notas, modelado en Neo4j.")

try:
    g = get_graph()
    m = get_metrics()
except Exception as exc:  # noqa: BLE001
    st.error(f"No se pudo conectar a Neo4j o cargar el grafo: {exc}\n\n"
             "¿Levantaste `docker compose up -d` y corriste `python -m codex.sync`?")
    st.stop()

rep = m["isolation"]
c1, c2, c3, c4 = st.columns(4)
c1.metric("Notas", rep["nodos"])
c2.metric("Enlaces", rep["aristas"])
c3.metric("Comunidades", len(m["communities"]))
c4.metric("Componente mayor", f"{rep['tamaño_componente_mayor']}/{rep['nodos']}")

tabs = st.tabs(
    ["📊 Centralidad", "🧩 Comunidades", "🔌 Aislamiento",
     "🔎 Semántica & Tiers", "🕸️ Explorador"]
)

# --- Centralidad ---------------------------------------------------------- #
with tabs[0]:
    st.subheader("¿Qué notas son el núcleo del conocimiento?")
    col_a, col_b = st.columns(2)
    with col_a:
        st.markdown("**PageRank** — influencia global")
        st.dataframe(pd.DataFrame(m["pagerank"]), use_container_width=True, hide_index=True)
    with col_b:
        st.markdown("**Betweenness** — puentes entre temas")
        st.dataframe(pd.DataFrame(m["betweenness"]), use_container_width=True, hide_index=True)
    st.markdown("**Más referenciadas** (in-degree)")
    st.dataframe(pd.DataFrame(m["in_degree"]), use_container_width=True, hide_index=True)

# --- Comunidades ---------------------------------------------------------- #
with tabs[1]:
    st.subheader("Comunidades temáticas detectadas (greedy modularity)")
    df = pd.DataFrame(m["communities"])
    df["miembros_clave"] = df["miembros_clave"].apply(lambda xs: " · ".join(xs))
    st.dataframe(df, use_container_width=True, hide_index=True)
    st.bar_chart(df.set_index("comunidad")["tamaño"])

# --- Aislamiento ---------------------------------------------------------- #
with tabs[2]:
    st.subheader("Salud estructural del vault")
    col_a, col_b, col_c = st.columns(3)
    col_a.metric("Huérfanos (sin inbound)", rep["huerfanos_sin_inbound"])
    col_b.metric("Sin outbound", rep["sin_outbound"])
    col_c.metric("Aislados (grado 0)", len(rep["aislados"]))
    st.markdown("**Notas completamente aisladas** — candidatas a enlazar:")
    if rep["aislados"]:
        st.write(rep["aislados"])
    else:
        st.success("Ninguna nota está totalmente aislada.")

# --- Semántica & Tiers ---------------------------------------------------- #
with tabs[3]:
    st.subheader("Agregaciones semánticas")
    sem = get_semantic()
    cols = st.columns(2)
    for i, (label, rows) in enumerate(sem.items()):
        with cols[i % 2]:
            st.markdown(f"**{label}**")
            st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)
    st.divider()
    st.subheader("Distribución de civs por tier")
    tiers = pd.DataFrame(get_tiers())
    if not tiers.empty:
        for lista in tiers["lista"].unique():
            st.markdown(f"**{lista}**")
            sub = tiers[tiers["lista"] == lista][["tier", "n"]].reset_index(drop=True)
            st.dataframe(sub, use_container_width=True, hide_index=True)

# --- Explorador ----------------------------------------------------------- #
with tabs[4]:
    st.subheader("Explorador de vecindario")
    titles = {g.nodes[n].get("title", n): n for n in g.nodes}
    pick = st.selectbox("Nota central", sorted(titles), index=None,
                        placeholder="Elegí una nota…")
    radius = st.slider("Radio", 1, 2, 1)
    if pick:
        subg = A.neighborhood(g, titles[pick], radius=radius)
        st.caption(f"{subg.number_of_nodes()} nodos · {subg.number_of_edges()} aristas")
        st.components.v1.html(render_graph(subg), height=620)
