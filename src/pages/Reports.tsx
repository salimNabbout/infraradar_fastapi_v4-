import { ErrorState } from '../components/ErrorState'
import { LoadingState } from '../components/LoadingState'
import { ReportCard } from '../components/ReportCard'
import { useAsyncData } from '../hooks/useAsyncData'
import { getReports } from '../services/api'

export function Reports() {
  const { data, loading, error } = useAsyncData(() => getReports(), [])

  if (loading) return <LoadingState message="Carregando relatórios..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((r) => (
        <ReportCard key={r.id} report={r} />
      ))}
    </div>
  )
}
