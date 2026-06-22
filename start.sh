#!/usr/bin/env bash
# ProForma local dev and Vercel build bootstrap.
#
# Local:   ./start.sh dev          # FastAPI :8000 + Next.js :3000
# Vercel:  installCommand/buildCommand -> ./start.sh install-web && ./start.sh build
#
# The ML/API service is not started on Vercel. Deploy FastAPI separately and set
# PROFORMA_API_URL to that host so Next.js rewrites can proxy /v1/* requests.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WEB_DIR="$ROOT_DIR/apps/web"
API_PORT="${PROFORMA_API_PORT:-8000}"
WEB_PORT="${PORT:-3000}"
API_HOST="${PROFORMA_API_HOST:-127.0.0.1}"
API_URL="${PROFORMA_API_URL:-http://${API_HOST}:${API_PORT}}"
PYTHON="${PYTHON:-python3}"

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

install_api_deps() {
  require_command "$PYTHON"
  "$PYTHON" -m pip install -r "$ROOT_DIR/requirements.txt"
}

install_web_deps() {
  require_command pnpm
  (cd "$WEB_DIR" && pnpm install --frozen-lockfile)
}

wait_for_api() {
  local attempts=30
  while [ "$attempts" -gt 0 ]; do
    if curl -fsS "$API_URL/health" >/dev/null 2>&1; then
      return 0
    fi
    attempts=$((attempts - 1))
    sleep 0.5
  done

  echo "Timed out waiting for ProForma API at $API_URL/health" >&2
  return 1
}

start_api() {
  cd "$ROOT_DIR"
  exec "$PYTHON" -m uvicorn services.api.app.main:create_app --factory --host "$API_HOST" --port "$API_PORT"
}

start_web() {
  cd "$WEB_DIR"
  export PROFORMA_API_URL="$API_URL"
  export NEXT_PUBLIC_PROFORMA_API_URL="$API_URL"
  if [ "${1:-dev}" = "prod" ]; then
    exec pnpm start --port "$WEB_PORT"
  fi
  exec pnpm dev --port "$WEB_PORT"
}

start_dev() {
  require_command curl
  install_api_deps
  install_web_deps

  cd "$ROOT_DIR"
  "$PYTHON" -m uvicorn services.api.app.main:create_app --factory --host "$API_HOST" --port "$API_PORT" &
  API_PID=$!

  cleanup() {
    if kill -0 "$API_PID" 2>/dev/null; then
      kill "$API_PID" 2>/dev/null || true
      wait "$API_PID" 2>/dev/null || true
    fi
  }
  trap cleanup EXIT INT TERM

  wait_for_api
  echo "ProForma API ready at $API_URL"
  echo "Starting web frontend on http://localhost:${WEB_PORT}"
  start_web dev
}

case "${1:-dev}" in
  install)
    install_api_deps
    install_web_deps
    ;;
  install-web)
    install_web_deps
    ;;
  build)
    install_web_deps
    cd "$WEB_DIR"
    pnpm build
    ;;
  api)
    install_api_deps
    start_api
    ;;
  web)
    install_web_deps
    start_web "${2:-dev}"
    ;;
  dev)
    start_dev
    ;;
  *)
    echo "Usage: $0 {dev|install|install-web|build|api|web [dev|prod]}" >&2
    exit 1
    ;;
esac
