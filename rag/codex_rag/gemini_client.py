"""Cliente mínimo de la API de Gemini (embeddings + generación) vía urllib.

Misma interfaz que `Ollama` (embed / embed_batch / generate) para que el resto
del pipeline sea agnóstico al proveedor. Sin dependencias externas.

La key sale de Google AI Studio (https://aistudio.google.com) — tier gratuito.
NO es lo mismo que la suscripción "Google AI Pro" (esa no da acceso programático).
"""

from __future__ import annotations

import json
import ssl
import time
import urllib.error
import urllib.request

BASE = "https://generativelanguage.googleapis.com/v1beta"

# Verificación TLS usando el almacén de certificados del SO (no certifi). Necesario
# en máquinas con antivirus/proxy que interceptan HTTPS con un CA propio que el
# bundle de Python no trae. truststore mantiene la verificación ACTIVADA.
# En entornos sin truststore (p.ej. el server de deploy) cae al contexto default.
try:
    import truststore
    _SSL_CTX = truststore.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
except Exception:  # noqa: BLE001 — truststore ausente o sin permisos
    _SSL_CTX = None
# Cosine similarity es invariante a la magnitud → no hace falta normalizar el
# vector truncado de gemini-embedding-001 (MRL) para el índice coseno de Neo4j.


class GeminiError(RuntimeError):
    pass


def _post(url: str, payload: dict, api_key: str, timeout: int = 120,
          retries: int = 5) -> dict:
    data = json.dumps(payload).encode("utf-8")
    headers = {"Content-Type": "application/json", "x-goog-api-key": api_key}
    delay = 2.0
    for attempt in range(retries):
        req = urllib.request.Request(url, data=data, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=timeout, context=_SSL_CTX) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", "ignore")
            # 429 (rate limit) y 5xx (transitorios) → backoff y reintento.
            if e.code in (429, 500, 503) and attempt < retries - 1:
                time.sleep(delay)
                delay = min(delay * 2, 30)
                continue
            raise GeminiError(f"HTTP {e.code}: {body[:500]}") from e
        except urllib.error.URLError as e:
            if attempt < retries - 1:
                time.sleep(delay)
                delay = min(delay * 2, 30)
                continue
            raise GeminiError(f"red: {e}") from e
    raise GeminiError("agotados los reintentos")


class Gemini:
    def __init__(self, api_key: str, embed_model: str, chat_model: str,
                 embed_dim: int = 768):
        if not api_key:
            raise GeminiError(
                "GEMINI_API_KEY vacío. Obtené una key gratis en "
                "https://aistudio.google.com y ponela en .env."
            )
        self.api_key = api_key
        self.embed_model = embed_model
        self.chat_model = chat_model
        self.embed_dim = embed_dim

    # ── embeddings ────────────────────────────────────────────────────────────
    def embed(self, text: str) -> list[float]:
        return self.embed_batch([text])[0]

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        model = self._mref(self.embed_model)
        requests = [
            {
                "model": model,
                "content": {"parts": [{"text": t}]},
                "outputDimensionality": self.embed_dim,
            }
            for t in texts
        ]
        url = f"{BASE}/{model}:batchEmbedContents"
        d = _post(url, {"requests": requests}, self.api_key, timeout=300)
        embs = d.get("embeddings", [])
        if len(embs) != len(texts):
            raise GeminiError(
                f"batchEmbed devolvió {len(embs)} vectores para {len(texts)} textos"
            )
        return [e["values"] for e in embs]

    # ── generación ────────────────────────────────────────────────────────────
    def generate(self, prompt: str, system: str | None = None,
                 temperature: float = 0.2) -> str:
        model = self._mref(self.chat_model)
        payload: dict = {
            "contents": [{"role": "user", "parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": temperature},
        }
        if system:
            payload["systemInstruction"] = {"parts": [{"text": system}]}
        url = f"{BASE}/{model}:generateContent"
        d = _post(url, payload, self.api_key, timeout=120)
        cands = d.get("candidates", [])
        if not cands:
            fb = d.get("promptFeedback", {})
            raise GeminiError(f"sin candidatos (feedback: {fb})")
        parts = cands[0].get("content", {}).get("parts", [])
        return "".join(p.get("text", "") for p in parts).strip()

    @staticmethod
    def _mref(model: str) -> str:
        """Normaliza el nombre a 'models/<x>' como espera la API."""
        return model if model.startswith("models/") else f"models/{model}"
