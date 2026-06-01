import { useState } from 'react'
import { DataTable, type Column } from '../components/DataTable'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FilterBar } from '../components/FilterBar'
import { KpiCard } from '../components/KpiCard'
import { LoadingState } from '../components/LoadingState'
import { OpportunityScore } from '../components/OpportunityScore'
import {
  StatusBadge,
  labelForStatus,
  toneForStatus,
} from '../components/StatusBadge'
import { useAsyncData } from '../hooks/useAsyncData'
import { useUiStore } from '../hooks/useUiStore'
import { getOpportunities } from '../services/api'
import { setores } from '../data/mockData'
import { formatCompactBRL, formatDate } from '../lib/format'
import type { Opportunity } from '../types'

export function Opportunities() {
  const [setor, setSetor] = useState('Todos')
  const query = useUiStore((s) => s.query).toLowerCase()
  const { data, loading, error } = useAsyncData(() => getOpportunities(), [])

  if (loading) return <LoadingState message="Carregando oportunidades..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  const rows = data.filter((o) => {
    const bySetor = setor === 'Todos' || o.setor === setor
    const byQuery =
      !query ||
      o.titulo.toLowerCase().includes(query) ||
      o.conta.toLowerCase().includes(query)
    return bySetor && byQuery
  })

  const ativas = data.filter(
    (o) => o.status !== 'ganha' && o.status !== 'perdida',
  )
  const totalPipeline = ativas.reduce((acc, o) => acc + o.valor, 0)
  const scoreMedio = Math.round(
    data.reduce((acc, o) => acc + o.score, 0) / data.length,
  )

  const columns: Array<Column<Opportunity>> = [
    {
      key: 'titulo',
      header: 'Oportunidade',
      render: (o) => (
        <div>
          <div className="font-medium text-white">{o.titulo}</div>
          <div className="text-xs text-slate-400">
            {o.conta} · {o.regiao}
          </div>
        </div>
      ),
    },
    {
      key: 'setor',
      header: 'Setor',
      render: (o) => <span className="text-slate-300">{o.setor}</span>,
    },
    {
      key: 'valor',
      header: 'Valor',
      align: 'right',
      render: (o) => (
        <span className="font-medium text-white">
          {formatCompactBRL(o.valor)}
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Score',
      render: (o) => <OpportunityScore score={o.score} size="sm" />,
    },
    {
      key: 'status',
      header: 'Status',
      render: (o) => (
        <StatusBadge
          label={labelForStatus(o.status)}
          tone={toneForStatus(o.status)}
        />
      ),
    },
    {
      key: 'resp',
      header: 'Responsável',
      render: (o) => (
        <div className="text-slate-300">
          {o.responsavel}
          <div className="text-xs text-slate-500">
            {formatDate(o.atualizadoEm)}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          kpi={{
            id: 'p',
            label: 'Pipeline ativo',
            value: formatCompactBRL(totalPipeline),
            delta: 12.4,
            trend: 'up',
          }}
        />
        <KpiCard
          kpi={{
            id: 'a',
            label: 'Oportunidades ativas',
            value: String(ativas.length),
            delta: 8.1,
            trend: 'up',
          }}
        />
        <KpiCard
          kpi={{
            id: 's',
            label: 'Score médio',
            value: String(scoreMedio),
            delta: 1.6,
            trend: 'up',
          }}
        />
      </div>

      <FilterBar options={setores} value={setor} onChange={setSetor} />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(o) => o.id}
        />
      )}
    </div>
  )
}
