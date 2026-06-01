import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FilterBar } from '../components/FilterBar'
import { LoadingState } from '../components/LoadingState'
import {
  StatusBadge,
  labelForStatus,
  toneForStatus,
} from '../components/StatusBadge'
import { useAsyncData } from '../hooks/useAsyncData'
import { useUiStore } from '../hooks/useUiStore'
import { getNews } from '../services/api'
import { setores } from '../data/mockData'
import { formatDate } from '../lib/format'

export function News() {
  const [setor, setSetor] = useState('Todos')
  const query = useUiStore((s) => s.query).toLowerCase()
  const { data, loading, error } = useAsyncData(() => getNews(), [])

  if (loading) return <LoadingState message="Carregando notícias e sinais..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  const rows = data.filter((n) => {
    const bySetor = setor === 'Todos' || n.setor === setor
    const byQuery =
      !query ||
      n.titulo.toLowerCase().includes(query) ||
      n.resumo.toLowerCase().includes(query)
    return bySetor && byQuery
  })

  return (
    <div className="space-y-6">
      <FilterBar options={setores} value={setor} onChange={setSetor} />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {rows.map((n) => (
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
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs text-slate-500">
                  {n.fonte} · {formatDate(n.data)}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">{n.titulo}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">
                {n.resumo}
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-tealbrand hover:underline"
              >
                Abrir fonte <ExternalLink size={12} />
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
