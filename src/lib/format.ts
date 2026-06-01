// Helpers de UI: formatacao e composicao de classes.

export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(' ')
}

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatCompactBRL(value: number): string {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 1,
    })} mi`
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString('pt-BR', {
      maximumFractionDigits: 0,
    })} mil`
  }
  return formatBRL(value)
}

export function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR')
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export function formatPercent(n: number): string {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`
}

export function daysUntil(iso: string): number {
  const d = new Date(iso).getTime()
  const now = Date.now()
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24))
}
