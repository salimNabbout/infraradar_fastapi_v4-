import { useState } from 'react'
import {
  AlertTriangle,
  Clock,
  ExternalLink,
  Lightbulb,
  ListChecks,
  Loader2,
  Search,
  Sparkles,
} from 'lucide-react'
import { InsightCard } from '../components/InsightCard'
import { getSearchHistory, searchPerplexity } from '../services/api'
import type { PerplexityResult } from '../services/api'
import { formatDate } from '../lib/format'

export function PerplexitySearch() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PerplexityResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const history = getSearchHistory()

  async function runSearch(consulta: string) {
    const termo = consulta.trim()
    if (!termo) return
    setInput(termo)
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await searchPerplexity(termo)
      setResult(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao consultar a busca.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-tealbrand/20 bg-gradient-to-br from-petroleum/30 to-panel p-5 shadow-executive">
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-300">
          <Sparkles size={16} className="text-tealbrand" />
          Pesquisa assistida por IA — o backend consulta a Perplexity em fontes
          atuais da web e devolve um resumo executivo com insights acionáveis.
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
              placeholder="Ex.: novos data centers anunciados em São Paulo em 2026"
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
        <div className="space-y-4 lg:col-span-2">
          {loading && (
            <div className="flex items-center gap-2 rounded-xl border border-white/5 bg-panel p-5 text-sm text-slate-400">
              <Loader2 size={16} className="animate-spin text-tealbrand" />
              Consultando a Perplexity, consolidando fontes e enriquecendo os
              resultados...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
              <div className="mb-2 flex items-center gap-2 text-rose-300">
                <AlertTriangle size={16} />
                <span className="text-sm font-semibold">Não foi possível buscar</span>
              </div>
              <p className="text-sm text-slate-300">{error}</p>
            </div>
          )}

          {!loading && !result && !error && (
            <InsightCard title="Como funciona" badge="IA">
              Digite uma consulta de mercado e clique em Buscar. O backend aciona
              a Perplexity, pesquisa fontes atuais e devolve um resumo executivo,
              insights acionáveis e próximos passos comerciais para a CETEM.
            </InsightCard>
          )}

          {!loading && result && (
            <article className="space-y-4 rounded-xl border border-white/5 bg-panel p-5 shadow-executive">
              <div>
                <div className="mb-1 flex items-center gap-2">
                  <Sparkles size={15} className="text-tealbrand" />
                  <h3 className="text-sm font-semibold text-white">
                    Resumo executivo
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">
                  {result.summary}
                </p>
              </div>

              {result.insights.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <Lightbulb size={15} className="text-amber-300" />
                    <h3 className="text-sm font-semibold text-white">Insights</h3>
                  </div>
                  <ul className="space-y-1.5">
                    {result.insights.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm leading-relaxed text-slate-300"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tealbrand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.nextSteps.length > 0 && (
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <ListChecks size={15} className="text-sky-300" />
                    <h3 className="text-sm font-semibold text-white">
                      Próximos passos
                    </h3>
                  </div>
                  <ul className="space-y-1.5">
                    {result.nextSteps.map((item, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm leading-relaxed text-slate-300"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.citations.length > 0 && (
                <div className="border-t border-white/5 pt-3">
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Fontes ({result.citations.length})
                  </h3>
                  <ul className="space-y-1">
                    {result.citations.map((c, i) => {
                      const isUrl = c.startsWith('http')
                      return (
                        <li key={i} className="truncate text-xs">
                          {isUrl ? (
                            <a
                              href={c}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-tealbrand hover:underline"
                            >
                              <ExternalLink size={11} className="shrink-0" />
                              {c}
                            </a>
                          ) : (
                            <span className="text-slate-400">{c}</span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-500">
                <span>{result.status}</span>
                <span>modelo: {result.model}</span>
              </div>
            </article>
          )}
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
