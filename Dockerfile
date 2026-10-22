# Imagen única Node + Python para el deploy del AoE2 Codex.
# - Node sirve la web/API (web/server.js) en $PORT.
# - El endpoint /api/chat hace shell-out a `python -m codex_rag.query` (GraphRAG).
# - Los datos viven en Neo4j (Aura) y el LLM en Gemini → no se necesita el vault
#   ni Ollama en runtime (solo lectura del grafo + llamadas a la API de Gemini).
FROM node:20-bookworm-slim

# Python para el pipeline GraphRAG.
RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 python3-venv \
 && rm -rf /var/lib/apt/lists/*

# venv aislado (evita el PEP668 "externally managed" de Debian bookworm).
ENV VENV=/opt/venv
RUN python3 -m venv $VENV
ENV PATH="$VENV/bin:$PATH" \
    PYTHON_BIN="$VENV/bin/python"

WORKDIR /app

# Paquetes Python: ingest primero (rag depende de aoe2-codex-ingest), luego rag.
COPY ingest ./ingest
COPY rag ./rag
RUN pip install --no-cache-dir ./ingest \
 && pip install --no-cache-dir ./rag

# Dependencias Node de la web (express + neo4j-driver).
COPY web/package.json web/package-lock.json ./web/
RUN cd web && npm ci --omit=dev

# Resto de la app (frontend, árbol vendorizado, etc.).
COPY web ./web

# Defaults de runtime; los secretos (NEO4J_*, GEMINI_API_KEY) los inyecta el host.
ENV NODE_ENV=production \
    LLM_PROVIDER=gemini \
    EMBED_DIM=768

# Render/hosts inyectan PORT; server.js lo respeta.
CMD ["node", "web/server.js"]
