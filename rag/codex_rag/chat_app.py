"""Chat GraphRAG en Streamlit.

    python -m streamlit run codex_rag/chat_app.py
"""

from __future__ import annotations

import streamlit as st

from codex.config import Config
from codex_rag.pipeline import answer

st.set_page_config(page_title="AoE2 Codex — Chat", layout="centered")


@st.cache_resource
def get_cfg() -> Config:
    return Config.load()


st.title("⚔️ AoE2 Codex — Chat GraphRAG")
st.caption(
    "Pregunta en lenguaje natural sobre tu base de conocimiento. Recuperación "
    "vectorial (bge-m3) + expansión por el grafo de wikilinks, respuesta con "
    "gemma3:4b — 100% local."
)

k = st.sidebar.slider("Chunks a recuperar (k)", 3, 12, 6)
ejemplos = [
    "¿Cómo juego Scout Rush con Georgianos?",
    "¿Qué recomienda Hera contra Franks?",
    "¿Cuáles son las fortalezas de Malians?",
]
st.sidebar.markdown("**Ejemplos:**")
for e in ejemplos:
    st.sidebar.write(f"• {e}")

if "history" not in st.session_state:
    st.session_state.history = []

def _render_answer(a) -> None:
    st.markdown(a.text)
    if a.abstained:
        st.warning("Abstención: ningún chunk superó el umbral de relevancia "
                   "→ se evita responder para no alucinar.")
        return
    with st.expander(f"📚 {len(a.sources)} fuentes · {len(a.related)} conexiones "
                     f"· score {a.max_score:.3f}"):
        st.write("**Fuentes recuperadas:** " + ", ".join(a.sources))
        if a.related:
            st.write("**Relacionadas en el grafo:** "
                     + ", ".join(r["title"] for r in a.related))


for q, a in st.session_state.history:
    with st.chat_message("user"):
        st.write(q)
    with st.chat_message("assistant"):
        _render_answer(a)

if prompt := st.chat_input("Tu pregunta sobre AoE2…"):
    with st.chat_message("user"):
        st.write(prompt)
    with st.chat_message("assistant"):
        with st.spinner("Recuperando del grafo y razonando…"):
            res = answer(prompt, cfg=get_cfg(), k=k)
        _render_answer(res)
    st.session_state.history.append((prompt, res))
