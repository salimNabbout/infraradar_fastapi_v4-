import { useState } from 'react'
import { DataTable, type Column } from '../components/DataTable'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FilterBar } from '../components/FilterBar'
import { LoadingState } from '../components/LoadingState'
import { OpportunityScore } from '../components/OpportunityScore'
import {
  StatusBadge,
  labelForStatus,
  toneForStatus,
} from '../components/StatusBadge'
import { useAsyncData } from '../hooks/useAsyncData'
import { useUiStore } from '../hooks/useUiStore'
import { getLeads } from '../services/api'
import type { Lead } from '../types'

const TEMPERATURAS = ['quente', 'morno', 'frio']

export function Leads() {
  const [temp, setTemp] = useState('Todos')
  const query = useUiStore((s) => s.query).toLowerCase()
  const { data, loading, error } = useAsyncData(() => getLeads(), [])

  if (loading) return <LoadingState message="Carregando leads..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  const rows = data.filter((l) => {
    const byTemp = temp === 'Todos' || l.status === temp
    const byQuery =
      !query ||
      l.empresa.toLowerCase().includes(query) ||
      l.contato.toLowerCase().includes(query)
    return byTemp && byQuery
  })

  const columns: Array<Column<Lead>> = [
    {
      key: 'empresa',
      header: 'Conta',
      render: (l) => (
        <div>
          <div className="font-medium text-white">{l.empresa}</div>
          <div className="text-xs text-slate-400">
            {l.contato} · {l.cargo}
          </div>
        </div>
      ),
    },
    {
      key: 'setor',
      header: 'Setor',
      render: (l) => <span className="text-slate-300">{l.setor}</span>,
    },
    {
      key: 'porte',
      header: 'Porte',
      render: (l) => <span className="text-slate-300">{l.porte}</span>,
    },
    {
      key: 'score',
      header: 'Score',
      render: (l) => <OpportunityScore score={l.score} size="sm" />,
    },
    {
      key: 'status',
      header: 'Temperatura',
      render: (l) => (
        <StatusBadge
          label={labelForStatus(l.status)}
          tone={toneForStatus(l.status)}
        />
      ),
    },
    {
      key: 'origem',
      header: 'Origem',
      render: (l) => (
        <div className="text-slate-300">
          {l.origem}
          <div className="text-xs text-slate-500">{l.regiao}</div>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar
        options={TEMPERATURAS.map((t) => labelForStatus(t))}
        value={temp === 'Todos' ? 'Todos' : labelForStatus(temp)}
        onChange={(v) => {
          if (v === 'Todos') return setTemp('Todos')
          const match = TEMPERATURAS.find((t) => labelForStatus(t) === v)
          setTemp(match ?? 'Todos')
        }}
      />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(l) => l.id} />
      )}
    </div>
  )
}
