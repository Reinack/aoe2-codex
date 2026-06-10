"""Configuración cargada desde .env (en la raíz del repo) o variables de entorno."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

# Raíz del repo = dos niveles arriba de este archivo (ingest/codex/config.py)
REPO_ROOT = Path(__file__).resolve().parents[2]
ENV_FILE = REPO_ROOT / ".env"
# Estado del sync: vive en el repo, NO en el vault (el vault queda read-only)
MANIFEST_PATH = REPO_ROOT / ".codex" / "manifest.json"


def _load_dotenv(path: Path) -> None:
    """Carga simple de .env -> os.environ (sin dependencia externa)."""
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip())


@dataclass
class Config:
    vault_path: Path
    exclude_dirs: set[str]
    neo4j_uri: str
    neo4j_user: str
    neo4j_password: str
    ollama_host: str = "http://localhost:11434"
    ollama_embed_model: str = "bge-m3"
    ollama_chat_model: str = "gemma3:4b"
    # Proveedor LLM: 'gemini' (cloud, default) o 'ollama' (100% local).
    llm_provider: str = "gemini"
    gemini_api_key: str = ""
    gemini_chat_model: str = "gemini-2.5-flash"
    gemini_embed_model: str = "gemini-embedding-001"
    # Dimensión del vector index: bge-m3=1024; gemini-embedding-001 truncado=768.
    embed_dim: int = 1024
    manifest_path: Path = field(default=MANIFEST_PATH)

    @classmethod
    def load(cls, vault_override: str | None = None) -> "Config":
        _load_dotenv(ENV_FILE)
        vault = vault_override or os.environ.get("VAULT_PATH", "")
        if not vault:
            raise SystemExit(
                "VAULT_PATH no definido. Copiá .env.example a .env o pasá --vault."
            )
        exclude = {
            d.strip()
            for d in os.environ.get("EXCLUDE_DIRS", ".obsidian,.trash,raw").split(",")
            if d.strip()
        }
        provider = os.environ.get("LLM_PROVIDER", "gemini").strip().lower()
        # Dimensión por defecto según proveedor; override explícito con EMBED_DIM.
        default_dim = 768 if provider == "gemini" else 1024
        embed_dim = int(os.environ.get("EMBED_DIM", default_dim))
        return cls(
            vault_path=Path(vault),
            exclude_dirs=exclude,
            neo4j_uri=os.environ.get("NEO4J_URI", "bolt://localhost:7687"),
            neo4j_user=os.environ.get("NEO4J_USER", "neo4j"),
            neo4j_password=os.environ.get("NEO4J_PASSWORD", "codexpass"),
            ollama_host=os.environ.get("OLLAMA_HOST", "http://localhost:11434"),
            ollama_embed_model=os.environ.get("OLLAMA_EMBED_MODEL", "bge-m3"),
            ollama_chat_model=os.environ.get("OLLAMA_CHAT_MODEL", "gemma3:4b"),
            llm_provider=provider,
            gemini_api_key=os.environ.get("GEMINI_API_KEY", ""),
            gemini_chat_model=os.environ.get("GEMINI_CHAT_MODEL", "gemini-2.5-flash"),
            gemini_embed_model=os.environ.get("GEMINI_EMBED_MODEL", "gemini-embedding-001"),
            embed_dim=embed_dim,
        )
