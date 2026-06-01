import { Bell, PanelLeft, Search } from 'lucide-react'
import { useUiStore, type PageKey } from '../hooks/useUiStore'

const TITLES: Record<PageKey, { titulo: string; subtitulo: string }> = {
  overview: {
    titulo: 'Visão Geral',
    subtitulo: 'Indicadores executivos e pulso de mercado',
  },
  radar: {
    titulo: 'Radar de Mercado',
    subtitulo: 'Sinais, gatilhos e movimentos por setor',
  },
  opportunities: {
    titulo: 'Oportunidades',
    subtitulo: 'Pipeline qualificado e priorizacao',
  },
  competitors: {
    titulo: 'Concorrentes',
    subtitulo: 'Matriz competitiva e movimentos',
  },
  leads: {
    titulo: 'Leads e Contas-Alvo',
    subtitulo: 'Contas prioritarias e temperatura',
  },
  projects: {
    titulo: 'Projetos e Licitações',
    subtitulo: 'Editais publicos, privados e PPP',
  },
  trends: {
    titulo: 'Tendências',
    subtitulo: 'Temas emergentes por impacto e momentum',
  },
  news: {
    titulo: 'Notícias e Sinais',
    subtitulo: 'Curadoria de noticias relevantes',
  },
  reports: {
    titulo: 'Relatórios',
    subtitulo: 'Entregaveis de inteligencia de mercado',
  },
  search: {
    titulo: 'Buscas Perplexity',
    subtitulo: 'Pesquisa assistida e historico',
  },
  settings: {
    titulo: 'Configurações',
    subtitulo: 'Preferencias e integracao',
  },
}

export function Header() {
  const page = useUiStore((s) => s.page)
  const toggleSidebar = useUiStore((s) => s.toggleSidebar)
  const query = useUiStore((s) => s.query)
  const setQuery = useUiStore((s) => s.setQuery)

  const { titulo, subtitulo } = TITLES[page]

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-white/5 bg-graphite/80 px-4 backdrop-blur md:px-6">
      <button
        type="button"
        onClick={toggleSidebar}
        className="hidden rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white md:block"
        title="Recolher menu"
      >
        <PanelLeft size={18} />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold text-white md:text-lg">
          {titulo}
        </h1>
        <p className="truncate text-xs text-slate-400">{subtitulo}</p>
      </div>

      <div className="relative hidden lg:block">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filtrar por palavra-chave..."
          className="w-64 rounded-lg border border-white/10 bg-steel/60 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-tealbrand/60 focus:outline-none"
        />
      </div>

      <button
        type="button"
        className="relative rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
        title="Notificacoes"
      >
        <Bell size={18} />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-tealbrand" />
      </button>

      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-petroleum/40 text-sm font-semibold text-tealbrand">
        SN
      </div>
    </header>
  )
}
