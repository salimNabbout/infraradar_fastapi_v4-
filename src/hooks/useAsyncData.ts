import { useEffect, useRef, useState } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Simula o comportamento de um app real: pequeno atraso de carregamento,
 * estados de loading/erro. Na integracao futura, o loader passa a chamar
 * a camada de services (FastAPI Cowork).
 */
export function useAsyncData<T>(
  loader: () => T,
  deps: ReadonlyArray<unknown> = [],
  delay = 350,
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const loaderRef = useRef(loader)
  loaderRef.current = loader

  useEffect(() => {
    let active = true
    setState({ data: null, loading: true, error: null })

    const timer = setTimeout(() => {
      if (!active) return
      try {
        setState({ data: loaderRef.current(), loading: false, error: null })
      } catch (err) {
        setState({
          data: null,
          loading: false,
          error: err instanceof Error ? err.message : 'Erro ao carregar dados',
        })
      }
    }, delay)

    return () => {
      active = false
      clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return state
}
