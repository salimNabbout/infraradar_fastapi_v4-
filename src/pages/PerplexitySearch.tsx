import { useState } from 'react'
import { Clock, Loader2, Search, Sparkles } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { InsightCard } from '../components/InsightCard'
import {
  StatusBadge,
  labelForStatus,
  toneForStatus,
} from '../components/StatusBadge'
import { getSearchHistory, searchPerplexity } from '../services/api'
import { formatDate } from '../lib/format'
import type { NewsSignal } from '../types'

export function PerplexitySearch() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<NewsSignal[] | null>(null)
  const history = getSearchHistory()

  async function runSearch(consulta: string) {
    const termo = consulta.trim()
    if (!termo) return
    setInput(termo)
    setLoading(true)
    setResults(null)
    const res = await searchPerplexity(termo)
    setResults(res)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-tealbrand/20 bg-gradient-to-br from-petroleum/30 to-panel p-5 shadow-executive">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <Sparkles size={16} className="text-tealbrand" />
          Pesquisa assistida — orquestrada pelo backend Cowork (Perplexity como
          motor conceitual). Aqui a busca é simulada sobre os sinais mockados.
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            void runSearch(input)
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ex.: novos data centers anunciados em São Paulo"
              className="w-full rounded-lg border border-white/10 bg-steel/60 py-2.5 pl-9 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-tealbrand/60 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-tealbrand px-4 py-2.5 text-sm font-semibold text-graphite transition hover:bg-tealbrand/90 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
            Buscar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-3 lg:col-span-2">
          {loading && (
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-panel p-5 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin text-tealbrand" />
              Consolidando fontes e enriquecendo resultados...
            </div>
          )}

          {!loading && results && results.length === 0 && (
            <EmptyState
              title="Sem resultados"
              message="Tente outra consulta ou um termo mais amplo."
            />
          )}

          {!loading && !results && (
            <InsightCard title="Como funciona" badge="Conceitual">
              Digite uma consulta de mercado. Na fase de produção, o backend
              Cowork aciona o Perplexity, consolida as fontes, enriquece por IA
              e devolve os insights estruturados para este painel.
            </InsightCard>
          )}

          {!loading &&
            results &&
            results.map((n) => (
              <article
                key={n.id}
                className="rounded-xl border border-white/5 bg-panel p-5 shadow-executive"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={labelForStatus(n.relevancia)}
                    tone={toneForStatus(n.relevancia)}
                  />
                  <span className="text-xs text-slate-400">{n.setor}</span>
                  <span className="text-xs text-slate-500">
                    · {n.fonte} · {formatDate(n.data)}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-white">{n.titulo}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">
                  {n.resumo}
                </p>
              </article>
            ))}
        </div>

        <div className="rounded-xl border border-white/5 bg-panel p-5 shadow-executive">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Clock size={15} className="text-slate-400" /> Histórico de buscas
          </div>
          <ul className="space-y-2">
            {history.map((h) => (
              <li key={h.id}>
                <button
                  type="button"
                  onClick={() => void runSearch(h.consulta)}
                  className="w-full rounded-lg border border-white/5 bg-steel/40 p-3 text-left transition hover:bg-white/5"
                >
                  <p className="text-sm text-slate-200">{h.consulta}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDate(h.data)} · {h.resultados} resultados
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
