import { create } from 'zustand'

export type PageKey =
  | 'overview'
  | 'radar'
  | 'opportunities'
  | 'competitors'
  | 'leads'
  | 'projects'
  | 'trends'
  | 'news'
  | 'reports'
  | 'search'
  | 'settings'

interface UiState {
  page: PageKey
  setPage: (page: PageKey) => void
  query: string
  setQuery: (query: string) => void
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebar: (open: boolean) => void
}

export const useUiStore = create<UiState>((set) => ({
  page: 'overview',
  setPage: (page) => set({ page }),
  query: '',
  setQuery: (query) => set({ query }),
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebar: (open) => set({ sidebarOpen: open }),
}))
