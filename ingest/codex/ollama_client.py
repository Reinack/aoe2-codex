"""Cliente mínimo de Ollama (embeddings + chat) vía HTTP, sin dependencias."""

from __future__ import annotations

import json
import urllib.error
import urllib.request


class OllamaHTTPError(RuntimeError):
    """Error HTTP de Ollama (p.ej. 400 por un input que el modelo rechaza)."""


class OllamaClient:
    # nomic-embed-text exige prefijos de tarea para buena calidad de retrieval
    DOC_PREFIX = "search_document: "
    QUERY_PREFIX = "search_query: "

    def __init__(self, host: str, embed_model: str, chat_model: str):
        self.host = host.rstrip("/")
        self.embed_model = embed_model
        self.chat_model = chat_model
        self._use_prefix = "nomic" in embed_model.lower()

    def _post(self, path: str, payload: dict, timeout: float = 300.0) -> dict:
        data = json.dumps(payload).encode("utf-8")
        req = urllib.request.Request(
            f"{self.host}{path}", data=data,
            headers={"Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as exc:
            # Error del servidor (4xx/5xx): manejable por el llamador
            raise OllamaHTTPError(f"HTTP {exc.code}") from exc
        except urllib.error.URLError as exc:
            # Conexión imposible: server caído -> fatal
            raise SystemExit(
                f"No se pudo contactar Ollama en {self.host}: {exc}\n"
                "¿Está corriendo 'ollama serve'?"
            )

    def embed(self, texts: list[str], keep_alive: str | None = None) -> list[list[float]]:
        """Embedding crudo por texto (endpoint batch /api/embed), sin prefijo.

        keep_alive='0' descarga el modelo tras la llamada (libera RAM para el LLM).
        """
        payload: dict = {"model": self.embed_model, "input": texts}
        if keep_alive is not None:
            payload["keep_alive"] = keep_alive
        out = self._post("/api/embed", payload)
        return out["embeddings"]

    def embed_one(self, text: str) -> list[float]:
        return self.embed([text])[0]

    def _embed_safe(self, texts: list[str]) -> list[list[float] | None]:
        """Embebe un lote; ante HTTP 400 lo parte recursivamente para aislar el
        input culpable, devolviendo None en su posición en vez de abortar todo."""
        if not texts:
            return []
        try:
            return list(self.embed(texts))
        except OllamaHTTPError:
            if len(texts) == 1:
                return [None]  # chunk patológico aislado -> se saltea
            mid = len(texts) // 2
            return self._embed_safe(texts[:mid]) + self._embed_safe(texts[mid:])

    def embed_documents(
        self, texts: list[str], batch_size: int = 16
    ) -> list[list[float] | None]:
        """Embeddings para indexar, en sub-lotes y resiliente a inputs inválidos."""
        if self._use_prefix:
            texts = [self.DOC_PREFIX + t for t in texts]
        out: list[list[float] | None] = []
        for i in range(0, len(texts), batch_size):
            out.extend(self._embed_safe(texts[i : i + batch_size]))
        return out

    def embed_query(self, text: str, keep_alive: str | None = "0") -> list[float]:
        """Embedding de una consulta. Por defecto descarga el modelo de embeddings
        tras la llamada (keep_alive='0') para liberar RAM antes de invocar el LLM."""
        if self._use_prefix:
            text = self.QUERY_PREFIX + text
        return self.embed([text], keep_alive=keep_alive)[0]

    def chat(self, system: str, user: str, temperature: float = 0.2) -> str:
        # timeout amplio: la primera llamada carga el modelo en memoria (cold start)
        out = self._post(
            "/api/chat",
            {
                "model": self.chat_model,
                "stream": False,
                "options": {"temperature": temperature},
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
            },
            timeout=600.0,
        )
        return out["message"]["content"]
