@echo off
REM ============================================================
REM  CETEM Market Intelligence - sobe backend + frontend juntos
REM ============================================================
setlocal
cd /d "%~dp0"

echo.
echo ============================================
echo   CETEM Market Intelligence
echo ============================================
echo.

REM ---------- Frontend: instala deps na 1a vez ----------
if not exist "node_modules" (
  echo [frontend] Instalando dependencias npm...
  call npm install
)
if not exist ".env" (
  echo VITE_API_URL=http://localhost:8000> .env
)

REM ---------- Backend: cria venv e instala deps na 1a vez ----------
if not exist "backend\.venv" (
  echo [backend] Criando ambiente virtual Python...
  python -m venv backend\.venv
  echo [backend] Instalando dependencias...
  call backend\.venv\Scripts\python.exe -m pip install --upgrade pip >nul
  call backend\.venv\Scripts\python.exe -m pip install -r backend\requirements.txt
)

REM ---------- Aviso sobre a chave da Perplexity ----------
if not exist "backend\.env" (
  copy "backend\.env.example" "backend\.env" >nul
  echo.
  echo  ATENCAO: configure sua chave em  backend\.env
  echo           PERPLEXITY_API_KEY=...
  echo.
)

REM ---------- Sobe os dois em janelas separadas ----------
echo [backend]  iniciando em http://localhost:8000 ...
start "CETEM Backend (FastAPI)" cmd /k "cd /d "%~dp0backend" && .venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

echo [frontend] iniciando em http://localhost:5173 ...
start "CETEM Frontend (Vite)" cmd /k "cd /d "%~dp0" && npm run dev"

echo.
echo Pronto. Duas janelas foram abertas:
echo   - Backend:  http://localhost:8000/docs
echo   - Frontend: http://localhost:5173
echo.
echo Feche este aviso quando quiser.
pause >nul
endlocal
