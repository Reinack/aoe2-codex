"""Factory de proveedor LLM: elige Ollama (local) o Gemini (cloud) según config.

Ambos clientes exponen la misma interfaz (embed / embed_batch / generate), así
que build.py y pipeline.py son agnósticos al proveedor.
"""

from __future__ import annotations

from codex.config import Config

from .gemini_client import Gemini
from .ollama_client import Ollama


def make_llm(cfg: Config):
    """Devuelve el cliente LLM según cfg.llm_provider ('ollama' | 'gemini')."""
    if cfg.llm_provider == "gemini":
        return Gemini(
            cfg.gemini_api_key,
            cfg.gemini_embed_model,
            cfg.gemini_chat_model,
            embed_dim=cfg.embed_dim,
            chat_fallback=cfg.gemini_chat_fallback,
        )
    return Ollama(cfg.ollama_host, cfg.ollama_embed_model, cfg.ollama_chat_model)
