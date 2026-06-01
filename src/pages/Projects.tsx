import { useState } from 'react'
import { DataTable, type Column } from '../components/DataTable'
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
import { getProjects } from '../services/api'
import { formatCompactBRL, formatDate, daysUntil } from '../lib/format'
import type { Project } from '../types'

const TIPOS = ['Licitação', 'Privado', 'PPP']

export function Projects() {
  const [tipo, setTipo] = useState('Todos')
  const { data, loading, error } = useAsyncData(() => getProjects(), [])

  if (loading) return <LoadingState message="Carregando projetos e licitações..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  const rows = tipo === 'Todos' ? data : data.filter((p) => p.tipo === tipo)

  const columns: Array<Column<Project>> = [
    {
      key: 'nome',
      header: 'Projeto',
      render: (p) => (
        <div>
          <div className="font-medium text-white">{p.nome}</div>
          <div className="text-xs text-slate-400">
            {p.orgao} · {p.regiao}
          </div>
        </div>
      ),
    },
    {
      key: 'tipo',
      header: 'Tipo',
      render: (p) => (
        <StatusBadge
          label={p.tipo}
          tone={
            p.tipo === 'Licitação'
              ? 'blue'
              : p.tipo === 'PPP'
                ? 'violet'
                : 'slate'
          }
        />
      ),
    },
    {
      key: 'valor',
      header: 'Valor',
      align: 'right',
      render: (p) => (
        <span className="font-medium text-white">
          {formatCompactBRL(p.valor)}
        </span>
      ),
    },
    {
      key: 'estagio',
      header: 'Estágio',
      render: (p) => (
        <StatusBadge
          label={labelForStatus(p.estagio)}
          tone={toneForStatus(p.estagio)}
        />
      ),
    },
    {
      key: 'prazo',
      header: 'Prazo',
      render: (p) => {
        const dias = daysUntil(p.prazo)
        return (
          <div className="text-slate-300">
            {formatDate(p.prazo)}
            <div
              className={
                dias < 0
                  ? 'text-xs text-slate-500'
                  : dias <= 21
                    ? 'text-xs text-amber-300'
                    : 'text-xs text-slate-500'
              }
            >
              {dias < 0 ? 'encerrado' : `${dias} dias`}
            </div>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <FilterBar options={TIPOS} value={tipo} onChange={setTipo} />

      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <DataTable columns={columns} rows={rows} rowKey={(p) => p.id} />
      )}
    </div>
  )
}
