# start.ps1 — levanta los servicios locales de aoe2-codex de una sola vez.
#
#   .\start.ps1              # Neo4j (Docker) + API Node (:3000) + dashboard Streamlit (:8501)
#   .\start.ps1 -Chat        # además, chat GraphRAG con UI (:8502)
#   .\start.ps1 -NoDashboard # sin el dashboard de analytics
#   .\start.ps1 -NoDocker    # no toca Docker (p.ej. si .env apunta a Aura)
#
# Cada servicio abre en su propia ventana de PowerShell para ver logs por separado.

param(
    [switch]$Chat,
    [switch]$NoDashboard,
    [switch]$NoDocker
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot

function Start-Service-Window([string]$title, [string]$workdir, [string]$command) {
    Start-Process powershell -ArgumentList @(
        '-NoExit',
        '-Command',
        "`$Host.UI.RawUI.WindowTitle = '$title'; Set-Location '$workdir'; $command"
    ) | Out-Null
    Write-Host "  [+] $title" -ForegroundColor Green
}

Write-Host "== aoe2-codex: servicios locales ==" -ForegroundColor Cyan

# --- 1. Neo4j (Docker Compose) ------------------------------------------------
if (-not $NoDocker) {
    docker info | Out-Null
    if (-not $?) {
        Write-Host "Docker no está corriendo. Abrí Docker Desktop y reintentá (o usá -NoDocker si apuntás a Aura)." -ForegroundColor Red
        exit 1
    }

    Write-Host "Levantando Neo4j (docker compose up -d)..." -ForegroundColor Yellow
    docker compose -f (Join-Path $root 'docker-compose.yml') up -d

    # Esperar el healthcheck (Browser HTTP en :7474)
    Write-Host "Esperando a que Neo4j esté listo" -NoNewline
    $ready = $false
    foreach ($i in 1..30) {
        try {
            Invoke-WebRequest -Uri 'http://localhost:7474' -UseBasicParsing -TimeoutSec 2 | Out-Null
            $ready = $true
            break
        } catch {
            Write-Host '.' -NoNewline
            Start-Sleep -Seconds 2
        }
    }
    Write-Host ''
    if (-not $ready) {
        Write-Host "Neo4j no respondió en :7474 tras ~60s. Revisá: docker compose logs neo4j" -ForegroundColor Red
        exit 1
    }
    Write-Host "  [+] Neo4j listo — http://localhost:7474 (bolt :7687)" -ForegroundColor Green
} else {
    Write-Host "(-NoDocker: se asume Neo4j accesible según .env)" -ForegroundColor DarkGray
}

# --- 2. API Node + frontend ----------------------------------------------------
Start-Service-Window 'aoe2-codex API (:3000)' (Join-Path $root 'web') 'node server.js'

# --- 3. Dashboard Streamlit (analytics) ----------------------------------------
if (-not $NoDashboard) {
    Start-Service-Window 'aoe2-codex dashboard (:8501)' (Join-Path $root 'analytics') `
        'python -m streamlit run codex_analytics/app.py --server.port 8501 --server.headless true'
}

# --- 4. Chat GraphRAG con UI (opcional) -----------------------------------------
if ($Chat) {
    Start-Service-Window 'aoe2-codex chat (:8502)' (Join-Path $root 'rag') `
        'python -m streamlit run codex_rag/chat_app.py --server.port 8502 --server.headless true'
}

Write-Host ''
Write-Host "Servicios:" -ForegroundColor Cyan
if (-not $NoDocker)    { Write-Host "  Neo4j Browser   http://localhost:7474" }
Write-Host "  Web + API       http://localhost:3000"
Write-Host "  Tech-tree       http://localhost:3000/tree/"
if (-not $NoDashboard) { Write-Host "  Dashboard       http://localhost:8501" }
if ($Chat)             { Write-Host "  Chat GraphRAG   http://localhost:8502" }
