import type { TrendItem } from '../types'
import { cn } from '../lib/format'
import { StatusBadge, labelForStatus, toneForStatus } from './StatusBadge'

interface TrendMatrixProps {
  trends: TrendItem[]
}

export function TrendMatrix({ trends }: TrendMatrixProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {trends.map((t) => (
        <div
          key={t.id}
          className="rounded-xl border border-white/5 bg-panel p-4 shadow-executive"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <h4 className="text-sm font-semibold text-white">{t.tema}</h4>
              <p className="text-xs text-slate-400">{t.setor}</p>
            </div>
            <StatusBadge
              label={labelForStatus(t.impacto)}
              tone={toneForStatus(t.impacto)}
            />
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-400">
            {t.descricao}
          </p>

          <div className="mt-3 space-y-2">
            <Meter label="Maturidade" value={t.maturidade} tone="bg-sky-400" />
            <Meter
              label="Momentum"
              value={Math.max(0, t.momentum)}
              tone="bg-tealbrand"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function Meter({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: string
}) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-[11px] text-slate-400">
        <span>{label}</span>
        <span className="tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn('h-full rounded-full', tone)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}
