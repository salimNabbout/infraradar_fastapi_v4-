#!/usr/bin/env bash
# ============================================================
#  CETEM Market Intelligence - sobe backend + frontend juntos
#  macOS / Linux
# ============================================================
set -e
cd "$(dirname "$0")"

echo "============================================"
echo "  CETEM Market Intelligence"
echo "============================================"

# ---------- Frontend ----------
if [ ! -d "node_modules" ]; then
  echo "[frontend] Instalando dependencias npm..."
  npm install
fi
[ -f ".env" ] || echo "VITE_API_URL=http://localhost:8000" > .env

# ---------- Backend ----------
if [ ! -d "backend/.venv" ]; then
  echo "[backend] Criando ambiente virtual Python..."
  python3 -m venv backend/.venv
  echo "[backend] Instalando dependencias..."
  backend/.venv/bin/pip install --upgrade pip >/dev/null
  backend/.venv/bin/pip install -r backend/requirements.txt
fi

if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env
  echo ""
  echo "  ATENCAO: configure sua chave em  backend/.env  (PERPLEXITY_API_KEY=...)"
  echo ""
fi

# ---------- Sobe os dois e encerra juntos ----------
echo "[backend]  http://localhost:8000"
( cd backend && .venv/bin/python -m uvicorn main:app --reload --port 8000 ) &
BACK_PID=$!

echo "[frontend] http://localhost:5173"
npm run dev &
FRONT_PID=$!

trap "echo; echo 'Encerrando...'; kill $BACK_PID $FRONT_PID 2>/dev/null; exit" INT TERM
echo ""
echo "Rodando. Ctrl+C para encerrar os dois."
wait
