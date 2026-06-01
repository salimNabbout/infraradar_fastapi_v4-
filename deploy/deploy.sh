#!/usr/bin/env bash
# =============================================================
#  CETEM Market Intelligence - script de atualizacao (deploy)
#  Uso na VPS:  bash deploy/deploy.sh
#  Faz: git pull -> build do frontend -> deps do backend ->
#       reinicia o servico do backend -> recarrega o nginx.
# =============================================================
set -euo pipefail

APP_DIR="/var/www/cetem-market-intelligence"
cd "$APP_DIR"

echo "==> [1/5] Atualizando codigo do GitHub..."
git pull origin main

echo "==> [2/5] Instalando dependencias e gerando build do frontend..."
npm ci
npm run build

echo "==> [3/5] Atualizando dependencias do backend..."
"$APP_DIR/backend/.venv/bin/pip" install -q -r backend/requirements.txt

echo "==> [4/5] Reiniciando o backend (FastAPI)..."
sudo systemctl restart cetem-backend

echo "==> [5/5] Recarregando o nginx..."
sudo nginx -t && sudo systemctl reload nginx

echo "==> Deploy concluido com sucesso."
