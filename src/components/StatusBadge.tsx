import { cn } from '../lib/format'

export type BadgeTone =
  | 'teal'
  | 'green'
  | 'amber'
  | 'red'
  | 'blue'
  | 'slate'
  | 'violet'

const TONES: Record<BadgeTone, string> = {
  teal: 'bg-tealbrand/15 text-tealbrand border-tealbrand/30',
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  red: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  blue: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  slate: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  violet: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
}

interface StatusBadgeProps {
  label: string
  tone?: BadgeTone
}

export function StatusBadge({ label, tone = 'slate' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        TONES[tone],
      )}
    >
      {label}
    </span>
  )
}

const STATUS_TONE: Record<string, BadgeTone> = {
  nova: 'blue',
  qualificando: 'amber',
  proposta: 'violet',
  ganha: 'green',
  perdida: 'red',
  frio: 'slate',
  morno: 'amber',
  quente: 'green',
  baixo: 'slate',
  medio: 'amber',
  alto: 'red',
  critico: 'red',
  identificado: 'slate',
  edital: 'blue',
  analise: 'amber',
  execucao: 'violet',
  concluido: 'green',
}

const STATUS_LABEL: Record<string, string> = {
  nova: 'Nova',
  qualificando: 'Qualificando',
  proposta: 'Proposta',
  ganha: 'Ganha',
  perdida: 'Perdida',
  frio: 'Frio',
  morno: 'Morno',
  quente: 'Quente',
  baixo: 'Baixo',
  medio: 'Médio',
  alto: 'Alto',
  critico: 'Crítico',
  identificado: 'Identificado',
  edital: 'Edital',
  analise: 'Análise',
  execucao: 'Execução',
  concluido: 'Concluído',
}

export function toneForStatus(status: string): BadgeTone {
  return STATUS_TONE[status] ?? 'slate'
}

export function labelForStatus(status: string): string {
  return STATUS_LABEL[status] ?? status
}
