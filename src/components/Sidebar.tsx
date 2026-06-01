import {
  Activity,
  BarChart3,
  Building2,
  FileText,
  LayoutDashboard,
  Lightbulb,
  Newspaper,
  Radar,
  Search,
  Settings,
  Target,
  Users,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { useUiStore, type PageKey } from '../hooks/useUiStore'
import { cn } from '../lib/format'

interface NavItem {
  key: PageKey
  label: string
  icon: ComponentType<{ size?: number | string; className?: string }>
}

const NAV: NavItem[] = [
  { key: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { key: 'radar', label: 'Radar de Mercado', icon: Radar },
  { key: 'opportunities', label: 'Oportunidades', icon: Target },
  { key: 'competitors', label: 'Concorrentes', icon: Building2 },
  { key: 'leads', label: 'Leads e Contas-Alvo', icon: Users },
  { key: 'projects', label: 'Projetos e Licitações', icon: Activity },
  { key: 'trends', label: 'Tendências', icon: Lightbulb },
  { key: 'news', label: 'Notícias e Sinais', icon: Newspaper },
  { key: 'reports', label: 'Relatórios', icon: FileText },
  { key: 'search', label: 'Buscas Perplexity', icon: Search },
  { key: 'settings', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const page = useUiStore((s) => s.page)
  const setPage = useUiStore((s) => s.setPage)
  const sidebarOpen = useUiStore((s) => s.sidebarOpen)

  return (
    <aside
      className={cn(
        'hidden shrink-0 border-r border-white/5 bg-panel/80 backdrop-blur md:flex md:flex-col',
        sidebarOpen ? 'md:w-64' : 'md:w-20',
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-white/5 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-tealbrand/15 text-tealbrand">
          <BarChart3 size={20} />
        </div>
        {sidebarOpen && (
          <div className="leading-tight">
            <div className="text-sm font-semibold text-white">CETEM</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-400">
              Market Intelligence
            </div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = page === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => setPage(item.key)}
              title={item.label}
              className={cn(
                'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition',
                active
                  ? 'bg-tealbrand/15 text-tealbrand'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white',
              )}
            >
              <Icon size={18} className="shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          )
        })}
      </nav>

      {sidebarOpen && (
        <div className="border-t border-white/5 p-4">
          <div className="rounded-lg bg-steel/60 p-3 text-xs text-slate-400">
            <div className="mb-1 font-medium text-slate-200">
              Motor de busca
            </div>
            Perplexity como camada conceitual de pesquisa, orquestrada via
            backend Cowork.
          </div>
        </div>
      )}
    </aside>
  )
}
