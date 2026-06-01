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

// POST /api/search/perplexity
// Na fase futura, o backend Cowork orquestra a busca no Perplexity,
// consolida fontes, enriquece por IA e retorna insights ao dashboard.
export async function searchPerplexity(query: string): Promise<NewsSignal[]> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  const termo = query.trim().toLowerCase()
  if (!termo) return []
  const base = newsSignals.filter(
    (n) =>
      n.titulo.toLowerCase().includes(termo) ||
      n.resumo.toLowerCase().includes(termo) ||
      n.setor.toLowerCase().includes(termo),
  )
  return base.length > 0 ? base : newsSignals.slice(0, 3)
}
