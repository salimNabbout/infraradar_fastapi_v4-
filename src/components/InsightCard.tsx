import { Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'

interface InsightCardProps {
  title: string
  children: ReactNode
  badge?: string
}

export function InsightCard({ title, children, badge }: InsightCardProps) {
  return (
    <div className="rounded-xl border border-tealbrand/20 bg-gradient-to-br from-petroleum/30 to-panel p-5 shadow-executive">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-tealbrand/20 text-tealbrand">
          <Sparkles size={15} />
        </span>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {badge && (
          <span className="ml-auto rounded-full bg-tealbrand/15 px-2 py-0.5 text-[11px] font-medium text-tealbrand">
            {badge}
          </span>
        )}
      </div>
      <div className="text-sm leading-relaxed text-slate-300">{children}</div>
    </div>
  )
}
