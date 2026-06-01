import { AppLayout } from './components/AppLayout'
import { useUiStore, type PageKey } from './hooks/useUiStore'
import { Overview } from './pages/Overview'
import { MarketRadar } from './pages/MarketRadar'
import { Opportunities } from './pages/Opportunities'
import { Competitors } from './pages/Competitors'
import { Leads } from './pages/Leads'
import { Projects } from './pages/Projects'
import { Trends } from './pages/Trends'
import { News } from './pages/News'
import { Reports } from './pages/Reports'
import { PerplexitySearch } from './pages/PerplexitySearch'
import { Settings } from './pages/Settings'
import type { JSX } from 'react'

const PAGES: Record<PageKey, () => JSX.Element> = {
  overview: Overview,
  radar: MarketRadar,
  opportunities: Opportunities,
  competitors: Competitors,
  leads: Leads,
  projects: Projects,
  trends: Trends,
  news: News,
  reports: Reports,
  search: PerplexitySearch,
  settings: Settings,
}

export default function App() {
  const page = useUiStore((s) => s.page)
  const Page = PAGES[page]

  return (
    <AppLayout>
      <Page />
    </AppLayout>
  )
}
