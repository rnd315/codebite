#!/usr/bin/env bash
# CodeBite dev startup script
# Runs backend (FastAPI) and frontend (Vite) in parallel.
# Usage: bash scripts/start.sh

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

echo "=== CodeBite Dev Server ==="

# Backend
echo "[backend] Starting FastAPI on http://localhost:8000"
cd "$BACKEND"
"$BACKEND/.venv/bin/uvicorn" main:app --reload --port 8000 &
BACKEND_PID=$!

# Frontend
echo "[frontend] Starting Vite on http://localhost:5173"
cd "$FRONTEND"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo "  API docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

# On Ctrl+C, kill both child processes
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM

wait
