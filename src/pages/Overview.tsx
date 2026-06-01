import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartCard } from '../components/ChartCard'
import { ErrorState } from '../components/ErrorState'
import { InsightCard } from '../components/InsightCard'
import { KpiCard } from '../components/KpiCard'
import { LoadingState } from '../components/LoadingState'
import { StatusBadge, toneForStatus } from '../components/StatusBadge'
import { useAsyncData } from '../hooks/useAsyncData'
import { getMarketSignals, getOverview } from '../services/api'
import { formatPercent } from '../lib/format'

const tooltipStyle = {
  background: '#0d1b20',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 12,
  color: '#e2e8f0',
  fontSize: 12,
}

export function Overview() {
  const { data, loading, error } = useAsyncData(
    () => ({ overview: getOverview(), signals: getMarketSignals() }),
    [],
  )

  if (loading) return <LoadingState message="Carregando visão geral..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  const { overview, signals } = data

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {overview.kpis.map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Evolução do pipeline (R$ mi)"
          subtitle="Realizado vs. meta nos últimos 6 meses"
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.pipeline}>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16b7a8" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#16b7a8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f3942" strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8' }} />
                <Area
                  type="monotone"
                  dataKey="valor"
                  name="Realizado"
                  stroke="#16b7a8"
                  strokeWidth={2}
                  fill="url(#grad)"
                />
                <Line
                  type="monotone"
                  dataKey="meta"
                  name="Meta"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Receita por setor (R$ mi)"
          subtitle="Distribuição do pipeline ativo"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={overview.receita}
                layout="vertical"
                margin={{ left: 10, right: 12 }}
              >
                <CartesianGrid stroke="#1f3942" strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="nome"
                  width={92}
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="valor" fill="#16b7a8" radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Funil comercial"
          subtitle="Volume por etapa"
          className="lg:col-span-2"
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.funil}>
                <CartesianGrid stroke="#1f3942" strokeDasharray="3 3" />
                <XAxis dataKey="nome" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                <Bar dataKey="valor" fill="#0b5563" radius={[4, 4, 0, 0]}>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <InsightCard title="Leitura executiva" badge="IA">
          O pipeline cresceu {formatPercent(12.4)} no mês, puxado por{' '}
          <strong className="text-tealbrand">Data Centers</strong> e{' '}
          <strong className="text-tealbrand">Energia</strong>. A taxa de
          conversão recuou levemente — recomenda-se priorizar as propostas com
          score acima de 80 e acelerar as licitações com prazo nas próximas 3
          semanas.
        </InsightCard>
      </div>

      <ChartCard
        title="Sinais de mercado em alta"
        subtitle="Principais gatilhos captados nos últimos 7 dias"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {signals.map((s) => (
            <div
              key={s.id}
              className="rounded-lg border border-white/5 bg-steel/40 p-4"
            >
              <div className="mb-2 flex items-center justify-between">
                <StatusBadge label={s.categoria} tone="teal" />
                <span className="text-xs font-semibold tabular-nums text-slate-300">
                  {s.forca}/100
                </span>
              </div>
              <p className="text-sm font-medium text-white">{s.titulo}</p>
              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{s.setor}</span>
                <StatusBadge
                  label={formatPercent(s.variacao)}
                  tone={toneForStatus(s.variacao >= 0 ? 'quente' : 'alto')}
                />
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
