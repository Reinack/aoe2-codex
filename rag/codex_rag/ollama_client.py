"""Cliente mínimo de Ollama (embeddings + generación) vía urllib — sin deps."""

from __future__ import annotations

import json
import urllib.request


def _post(url: str, payload: dict, timeout: int = 300) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url, data=data, headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


class Ollama:
    def __init__(self, host: str, embed_model: str, chat_model: str):
        self.host = host.rstrip("/")
        self.embed_model = embed_model
        self.chat_model = chat_model

    def embed(self, text: str) -> list[float]:
        return self.embed_batch([text])[0]

    def embed_batch(self, texts: list[str]) -> list[list[float]]:
        d = _post(
            f"{self.host}/api/embed",
            {"model": self.embed_model, "input": texts},
            timeout=600,
        )
        return d["embeddings"]

    def generate(self, prompt: str, system: str | None = None,
                 temperature: float = 0.2) -> str:
        payload = {
            "model": self.chat_model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": temperature},
        }
        if system:
            payload["system"] = system
        d = _post(f"{self.host}/api/generate", payload, timeout=600)
        return d["response"].strip()
