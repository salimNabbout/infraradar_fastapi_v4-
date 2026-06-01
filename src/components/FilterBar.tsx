import { Filter } from 'lucide-react'
import { cn } from '../lib/format'

interface FilterBarProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  allLabel?: string
}

export function FilterBar({
  options,
  value,
  onChange,
  allLabel = 'Todos',
}: FilterBarProps) {
  const items = [allLabel, ...options]
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 inline-flex items-center gap-1.5 text-xs text-slate-400">
        <Filter size={14} /> Filtrar:
      </span>
      {items.map((item) => {
        const active = value === item
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition',
              active
                ? 'border-tealbrand/40 bg-tealbrand/15 text-tealbrand'
                : 'border-white/10 bg-steel/40 text-slate-300 hover:bg-white/5 hover:text-white',
            )}
          >
            {item}
          </button>
        )
      })}
    </div>
  )
}
