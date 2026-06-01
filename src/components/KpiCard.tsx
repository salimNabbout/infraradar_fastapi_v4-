import { Minus, TrendingDown, TrendingUp } from 'lucide-react'
import type { Kpi } from '../types'
import { cn, formatPercent } from '../lib/format'

interface KpiCardProps {
  kpi: Kpi
}

export function KpiCard({ kpi }: KpiCardProps) {
  const isUp = kpi.trend === 'up'
  const isDown = kpi.trend === 'down'

  return (
    <div className="rounded-xl border border-white/5 bg-panel p-5 shadow-executive">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {kpi.label}
        </p>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            isUp && 'bg-emerald-500/15 text-emerald-300',
            isDown && 'bg-rose-500/15 text-rose-300',
            !isUp && !isDown && 'bg-slate-500/15 text-slate-300',
          )}
        >
          {isUp && <TrendingUp size={12} />}
          {isDown && <TrendingDown size={12} />}
          {!isUp && !isDown && <Minus size={12} />}
          {formatPercent(kpi.delta)}
        </span>
      </div>
      <div className="mt-3 text-2xl font-semibold text-white">{kpi.value}</div>
      {kpi.hint && <p className="mt-1 text-xs text-slate-500">{kpi.hint}</p>}
    </div>
  )
}
