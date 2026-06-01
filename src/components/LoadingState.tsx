import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = 'Carregando dados...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-panel/50 px-6 py-14 text-center">
      <Loader2 size={26} className="mb-3 animate-spin text-tealbrand" />
      <p className="text-sm text-slate-400">{message}</p>
    </div>
  )
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-xl border border-white/5 bg-panel/60"
        />
      ))}
    </div>
  )
}
