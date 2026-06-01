import { useState } from 'react'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { FilterBar } from '../components/FilterBar'
import { LoadingState } from '../components/LoadingState'
import { TrendMatrix } from '../components/TrendMatrix'
import { useAsyncData } from '../hooks/useAsyncData'
import { getTrends } from '../services/api'
import { setores } from '../data/mockData'

export function Trends() {
  const [setor, setSetor] = useState('Todos')
  const { data, loading, error } = useAsyncData(() => getTrends(), [])

  if (loading) return <LoadingState message="Carregando tendências..." />
  if (error || !data) return <ErrorState message={error ?? undefined} />

  const rows = setor === 'Todos' ? data : data.filter((t) => t.setor === setor)

  return (
    <div className="space-y-6">
      <FilterBar options={setores} value={setor} onChange={setSetor} />
      {rows.length === 0 ? <EmptyState /> : <TrendMatrix trends={rows} />}
    </div>
  )
}
