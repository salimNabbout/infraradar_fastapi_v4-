import { cn } from '../lib/format'

interface OpportunityScoreProps {
  score: number
  size?: 'sm' | 'md'
}

function colorFor(score: number): string {
  if (score >= 85) return 'text-emerald-300'
  if (score >= 70) return 'text-tealbrand'
  if (score >= 55) return 'text-amber-300'
  return 'text-rose-300'
}

function barFor(score: number): string {
  if (score >= 85) return 'bg-emerald-400'
  if (score >= 70) return 'bg-tealbrand'
  if (score >= 55) return 'bg-amber-400'
  return 'bg-rose-400'
}

export function OpportunityScore({ score, size = 'md' }: OpportunityScoreProps) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          'h-1.5 overflow-hidden rounded-full bg-white/10',
          size === 'sm' ? 'w-16' : 'w-24',
        )}
      >
        <div
          className={cn('h-full rounded-full', barFor(score))}
          style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
        />
      </div>
      <span className={cn('text-sm font-semibold tabular-nums', colorFor(score))}>
        {score}
      </span>
    </div>
  )
}
