// Tipagens centrais do dominio de inteligencia de mercado da CETEM.

export type Trend = 'up' | 'down' | 'flat'

export type Severity = 'baixo' | 'medio' | 'alto' | 'critico'

export type OpportunityStatus =
  | 'nova'
  | 'qualificando'
  | 'proposta'
  | 'ganha'
  | 'perdida'

export type ProjectStage =
  | 'identificado'
  | 'edital'
  | 'analise'
  | 'proposta'
  | 'execucao'
  | 'concluido'

export type LeadTemperature = 'frio' | 'morno' | 'quente'

export type Sector =
  | 'Automação'
  | 'BMS'
  | 'Infraestrutura'
  | 'Automação Industrial'
  | 'Energia'
  | 'Data Centers'
  | 'Hospitais'
  | 'Facilities'
  | 'Setor Público'

export interface Kpi {
  id: string
  label: string
  value: string
  delta: number
  trend: Trend
  hint?: string
}

export interface SeriesPoint {
  label: string
  valor: number
  meta?: number
}

export interface CategoryValue {
  nome: string
  valor: number
}

export interface Opportunity {
  id: string
  titulo: string
  conta: string
  setor: Sector
  valor: number
  score: number
  status: OpportunityStatus
  responsavel: string
  atualizadoEm: string
  regiao: string
}

export interface Competitor {
  id: string
  nome: string
  foco: string
  participacao: number
  forca: number
  preco: number
  inovacao: number
  presenca: number
  movimento: string
}

export interface Lead {
  id: string
  empresa: string
  contato: string
  cargo: string
  setor: Sector
  porte: 'Pequeno' | 'Médio' | 'Grande' | 'Corporativo'
  score: number
  status: LeadTemperature
  origem: string
  regiao: string
}

export interface Project {
  id: string
  nome: string
  orgao: string
  tipo: 'Licitação' | 'Privado' | 'PPP'
  setor: Sector
  valor: number
  estagio: ProjectStage
  prazo: string
  regiao: string
}

export interface TrendItem {
  id: string
  tema: string
  setor: Sector
  impacto: Severity
  maturidade: number
  momentum: number
  descricao: string
}

export interface NewsSignal {
  id: string
  titulo: string
  fonte: string
  data: string
  setor: Sector
  relevancia: Severity
  resumo: string
  url?: string
}

export interface Report {
  id: string
  titulo: string
  tipo: string
  periodo: string
  atualizadoEm: string
  paginas: number
  destaque: string
}

export interface SearchHistoryItem {
  id: string
  consulta: string
  data: string
  resultados: number
  setor?: Sector
}

export interface MarketSignal {
  id: string
  titulo: string
  categoria: string
  forca: number
  variacao: number
  setor: Sector
}
