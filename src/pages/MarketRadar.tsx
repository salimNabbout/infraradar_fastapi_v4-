import { useState } from 'react'
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { ChartCard } from '../components/ChartCard'
import { ErrorState } from '../components/ErrorState'
import { EmptyState } from '../components/EmptyState'
import { FilterBar } from '../components/FilterBar'
import { LoadingState } from '../components/LoadingState'
import { StatusBadge, toneForStatus } from '../components/StatusBadge'
import { useAsyncData } from '../hooks/useAsyncData'
import { getMarketSignals } from '../services/api'
import { setores } from '../data/mockData'
import { formatPercent } from '../lib/format'

export function MarketRadar() {
  const [setor, setSetor] = useState('Todos')
  const { data, loading, error } = useAsyncData(() => getMarketSignals(), [])

  if (loading) return <LoadingState message="Carregando radar de mercado..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  const filtered =
    setor === 'Todos' ? data : data.filter((s) => s.setor === setor)

  const radarData = data.map((s) => ({
    setor: s.setor.length > 12 ? `${s.setor.slice(0, 11)}…` : s.setor,
    forca: s.forca,
  }))

  return (
    <div className="space-y-6">
      <FilterBar options={setores} value={setor} onChange={setSetor} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Intensidade dos sinais por setor"
          subtitle="Força relativa dos gatilhos captados"
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="72%">
                <PolarGrid stroke="#1f3942" />
                <PolarAngleAxis
                  dataKey="setor"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <PolarRadiusAxis
                  domain={[0, 100]}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <Radar
                  dataKey="forca"
                  stroke="#16b7a8"
                  fill="#16b7a8"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    background: '#0d1b20',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    color: '#e2e8f0',
                    fontSize: 12,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Sinais detalhados"
          subtitle={`${filtered.length} sinal(is) no recorte atual`}
        >
          {filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-white/5 bg-steel/40 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-medium text-white">{s.titulo}</p>
                    <StatusBadge
                      label={formatPercent(s.variacao)}
                      tone={toneForStatus(s.variacao >= 0 ? 'quente' : 'alto')}
                    />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                    <StatusBadge label={s.categoria} tone="teal" />
                    <span>{s.setor}</span>
                    <span className="ml-auto font-semibold tabular-nums text-slate-300">
                      {s.forca}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ChartCard>
      </div>
    </div>
  )
}
