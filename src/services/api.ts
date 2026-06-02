// Camada de servico preparada para integracao futura com FastAPI (Cowork).
// Hoje retorna dados mockados. Os comentarios indicam os endpoints previstos.
//
// Fluxo previsto:
//   Usuario -> Dashboard CETEM -> FastAPI Cowork -> Perplexity Search
//           -> Processamento IA -> Retorno de insights ao dashboard

import {
  competitors,
  executiveKpis,
  funilComercial,
  leads,
  marketSignals,
  newsSignals,
  opportunities,
  pipelinePorMes,
  projects,
  receitaPorSetor,
  reports,
  searchHistory,
  trends,
} from '../data/mockData'
import type {
  Competitor,
  Kpi,
  Lead,
  MarketSignal,
  NewsSignal,
  Opportunity,
  Project,
  Report,
  SearchHistoryItem,
  TrendItem,
} from '../types'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ??
  'http://localhost:8000'

export function getApiBaseUrl(): string {
  return API_URL
}

// GET /api/dashboard/overview
export function getOverview(): {
  kpis: Kpi[]
  pipeline: typeof pipelinePorMes
  receita: typeof receitaPorSetor
  funil: typeof funilComercial
} {
  return {
    kpis: executiveKpis,
    pipeline: pipelinePorMes,
    receita: receitaPorSetor,
    funil: funilComercial,
  }
}

// GET /api/market/signals
export function getMarketSignals(): MarketSignal[] {
  return marketSignals
}

// GET /api/opportunities
export function getOpportunities(): Opportunity[] {
  return opportunities
}

// GET /api/competitors
export function getCompetitors(): Competitor[] {
  return competitors
}

// GET /api/leads
export function getLeads(): Lead[] {
  return leads
}

// GET /api/projects
export function getProjects(): Project[] {
  return projects
}

// GET /api/trends
export function getTrends(): TrendItem[] {
  return trends
}

// GET /api/news (sinais e noticias)
export function getNews(): NewsSignal[] {
  return newsSignals
}

// GET /api/reports
export function getReports(): Report[] {
  return reports
}

// GET /api/search/history
export function getSearchHistory(): SearchHistoryItem[] {
  return searchHistory
}

// Resposta estruturada que o backend FastAPI devolve a partir da Perplexity.
export interface PerplexityResult {
  query: string
  type: string
  status: string
  sources: number
  summary: string
  insights: string[]
  nextSteps: string[]
  citations: string[]
  model: string
}

// POST /api/search/perplexity
// Chama o backend real (o nginx encaminha /api para o FastAPI em 127.0.0.1:8000).
// O backend orquestra a Perplexity, consolida as fontes e devolve insights.
export async function searchPerplexity(
  query: string,
  type = 'Pesquisa livre',
): Promise<PerplexityResult> {
  const resp = await fetch('/api/search/perplexity', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, type }),
  })

  if (!resp.ok) {
    let detail = `Falha na busca (HTTP ${resp.status}).`
    try {
      const err = await resp.json()
      if (err && err.detail) detail = String(err.detail)
    } catch {
      // resposta sem corpo JSON
    }
    throw new Error(detail)
  }

  return (await resp.json()) as PerplexityResult
}
