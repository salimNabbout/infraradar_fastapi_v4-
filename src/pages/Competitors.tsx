import { ChartCard } from '../components/ChartCard'
import { CompetitorMatrix } from '../components/CompetitorMatrix'
import { DataTable, type Column } from '../components/DataTable'
import { ErrorState } from '../components/ErrorState'
import { InsightCard } from '../components/InsightCard'
import { LoadingState } from '../components/LoadingState'
import { OpportunityScore } from '../components/OpportunityScore'
import { useAsyncData } from '../hooks/useAsyncData'
import { getCompetitors } from '../services/api'
import type { Competitor } from '../types'

export function Competitors() {
  const { data, loading, error } = useAsyncData(() => getCompetitors(), [])

  if (loading) return <LoadingState message="Carregando concorrentes..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  const columns: Array<Column<Competitor>> = [
    {
      key: 'nome',
      header: 'Concorrente',
      render: (c) => (
        <div>
          <div className="font-medium text-white">{c.nome}</div>
          <div className="text-xs text-slate-400">{c.foco}</div>
        </div>
      ),
    },
    {
      key: 'share',
      header: 'Share',
      align: 'right',
      render: (c) => (
        <span className="font-medium text-white">{c.participacao}%</span>
      ),
    },
    {
      key: 'forca',
      header: 'Força',
      render: (c) => <OpportunityScore score={c.forca} size="sm" />,
    },
    {
      key: 'inov',
      header: 'Inovação',
      render: (c) => <OpportunityScore score={c.inovacao} size="sm" />,
    },
    {
      key: 'mov',
      header: 'Movimento recente',
      render: (c) => (
        <span className="text-sm text-slate-300">{c.movimento}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Matriz competitiva"
          subtitle="Inovação x presença (tamanho = market share)"
          className="lg:col-span-2"
        >
          <CompetitorMatrix competitors={data} />
        </ChartCard>

        <InsightCard title="Alerta competitivo" badge="IA">
          <strong className="text-tealbrand">DataHall Infra</strong> lidera em
          inovação e share no segmento de data centers, reforçada por parceria
          internacional. Para neutralizar, vale destacar diferenciais de
          serviço local e tempo de resposta nas propostas da NorthEdge Cloud.
        </InsightCard>
      </div>

      <DataTable columns={columns} rows={data} rowKey={(c) => c.id} />
    </div>
  )
}
