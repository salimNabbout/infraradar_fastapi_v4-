"""
CETEM Market Intelligence — Backend de integração com Perplexity.

Fluxo: Dashboard (frontend) -> FastAPI (este servidor) -> Perplexity Sonar -> Insights estruturados -> Dashboard.
A chave da Perplexity fica somente aqui, nunca é exposta ao navegador.
"""
import os
import json
import re
from typing import Literal

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

load_dotenv()

PERPLEXITY_API_KEY = os.getenv("PERPLEXITY_API_KEY", "").strip()
PERPLEXITY_MODEL = os.getenv("PERPLEXITY_MODEL", "sonar").strip() or "sonar"
PERPLEXITY_URL = "https://api.perplexity.ai/chat/completions"
CORS_ORIGINS = [o.strip() for o in os.getenv(
    "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
).split(",") if o.strip()]

app = FastAPI(title="CETEM Market Intelligence API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SearchType = Literal[
    "Análise de concorrente", "Tendência de mercado", "Prospecção de leads",
    "Monitoramento de notícia", "Projeto ou licitação", "Análise setorial", "Pesquisa livre",
]


class SearchRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=600)
    type: str = "Pesquisa livre"


class SearchResponse(BaseModel):
    query: str
    type: str
    status: str
    sources: int
    summary: str
    insights: list[str]
    nextSteps: list[str]
    citations: list[str] = []
    model: str = ""


# Contexto de negócio: orienta a Perplexity a responder como analista da CETEM.
SYSTEM_PROMPT = (
    "Você é um analista sênior de inteligência de mercado da CETEM Tecnologia, "
    "empresa B2B brasileira que atua com automação predial (BMS), automação industrial, "
    "energia, eficiência energética, data centers, hospitais, facilities e infraestrutura "
    "crítica, incluindo projetos públicos e privados. Pesquise na web fontes atuais e "
    "confiáveis e responda SEMPRE em português do Brasil, com foco comercial e acionável. "
    "Retorne EXCLUSIVAMENTE um objeto JSON válido, sem texto fora do JSON, no formato:\n"
    "{\n"
    '  "summary": "<resumo executivo objetivo em 2-4 frases>",\n'
    '  "insights": ["<insight acionável 1>", "<insight 2>", "<insight 3>"],\n'
    '  "nextSteps": ["<próximo passo comercial 1>", "<passo 2>"]\n'
    "}\n"
    "Os insights devem destacar oportunidades, riscos, movimentos de concorrentes ou "
    "aderência técnica para a CETEM. Não inclua comentários, markdown ou crases."
)


def build_user_prompt(query: str, search_type: str) -> str:
    return (
        f"Tipo de pesquisa: {search_type}.\n"
        f"Pergunta/objetivo: {query}\n\n"
        "Gere o JSON com summary, insights e nextSteps conforme instruído."
    )


def extract_json(text: str) -> dict | None:
    """Tenta extrair o objeto JSON da resposta do modelo, mesmo com ruído ao redor."""
    text = text.strip()
    # remove cercas de código se houver
    text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.MULTILINE).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass
    match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            return None
    return None


@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "perplexityConfigured": bool(PERPLEXITY_API_KEY),
        "model": PERPLEXITY_MODEL,
    }


@app.post("/api/search/perplexity", response_model=SearchResponse)
async def search_perplexity(req: SearchRequest):
    if not PERPLEXITY_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="PERPLEXITY_API_KEY não configurada. Defina a chave no arquivo backend/.env.",
        )

    payload = {
        "model": PERPLEXITY_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": build_user_prompt(req.query, req.type)},
        ],
        "temperature": 0.2,
    }
    headers = {
        "Authorization": f"Bearer {PERPLEXITY_API_KEY}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            resp = await client.post(PERPLEXITY_URL, json=payload, headers=headers)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Falha ao contatar a Perplexity: {exc}")

    if resp.status_code == 401:
        raise HTTPException(status_code=401, detail="Chave da Perplexity inválida ou expirada.")
    if resp.status_code != 200:
        raise HTTPException(
            status_code=502,
            detail=f"Perplexity retornou {resp.status_code}: {resp.text[:300]}",
        )

    data = resp.json()
    content = data["choices"][0]["message"]["content"]
    citations = data.get("citations") or data.get("search_results") or []
    # normaliza citações para lista de URLs/strings
    norm_citations: list[str] = []
    for c in citations:
        if isinstance(c, str):
            norm_citations.append(c)
        elif isinstance(c, dict):
            norm_citations.append(c.get("url") or c.get("title") or json.dumps(c))

    parsed = extract_json(content)
    if parsed is None:
        # fallback: usa o texto bruto como summary se o modelo não devolveu JSON
        parsed = {"summary": content.strip()[:800], "insights": [], "nextSteps": []}

    return SearchResponse(
        query=req.query,
        type=req.type,
        status="Concluída",
        sources=len(norm_citations),
        summary=parsed.get("summary", "").strip() or "Sem resumo retornado.",
        insights=[str(i) for i in parsed.get("insights", []) if str(i).strip()],
        nextSteps=[str(s) for s in parsed.get("nextSteps", []) if str(s).strip()],
        citations=norm_citations,
        model=PERPLEXITY_MODEL,
    )
