# CETEM Market Intelligence — Backend (Perplexity)

Servidor FastAPI que integra o dashboard à API da Perplexity (Sonar).
O dashboard nunca chama a Perplexity diretamente: este backend recebe a busca,
monta o prompt de analista de mercado, consulta a Perplexity e devolve insights
estruturados (resumo, insights, próximos passos e fontes).

A chave da Perplexity fica **somente** neste servidor, protegida no arquivo `.env`.

## 1. Instalar dependências

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
```

## 2. Configurar a chave da Perplexity

Copie o exemplo e edite:

```bash
copy .env.example .env      # Windows
# cp .env.example .env      # macOS/Linux
```

No `.env`, cole sua chave (obtida em https://www.perplexity.ai/settings/api):

```
PERPLEXITY_API_KEY=pplx-xxxxxxxxxxxxxxxxxxxx
PERPLEXITY_MODEL=sonar
```

Modelos: `sonar` (rápido/barato) ou `sonar-pro` (busca mais profunda).

## 3. Rodar o backend

```bash
uvicorn main:app --reload --port 8000
```

Verifique: http://localhost:8000/api/health
Documentação interativa: http://localhost:8000/docs

## 4. Rodar o frontend

Em outro terminal, na raiz do projeto:

```bash
npm run dev
```

O frontend lê `VITE_API_URL` do arquivo `.env` na raiz (padrão `http://localhost:8000`).
Abra http://localhost:5173 → aba **Buscas Perplexity** e faça uma pesquisa.

## Endpoints

```
GET  /api/health                 -> status do servidor e se a key está configurada
POST /api/search/perplexity      -> { query, type } -> insights estruturados
```

Exemplo de chamada:

```bash
curl -X POST http://localhost:8000/api/search/perplexity \
  -H "Content-Type: application/json" \
  -d '{"query":"projetos de data center no Sudeste com demanda por BMS","type":"Projeto ou licitação"}'
```

## Resposta

```json
{
  "query": "...",
  "type": "Projeto ou licitação",
  "status": "Concluída",
  "sources": 8,
  "summary": "Resumo executivo...",
  "insights": ["...", "..."],
  "nextSteps": ["...", "..."],
  "citations": ["https://...", "https://..."],
  "model": "sonar"
}
```

## Segurança

- A `PERPLEXITY_API_KEY` nunca é enviada ao navegador.
- O `.env` está no `.gitignore` e não deve ser versionado.
- CORS liberado apenas para as origens em `CORS_ORIGINS` (padrão: localhost:5173).
