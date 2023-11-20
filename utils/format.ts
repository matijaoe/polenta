import { formatDistanceToNow } from 'date-fns'

const locale = 'en-US'

export const formatNumber = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat(locale, {
    ...options
  }).format(value)
}

export const formatCurrency = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    ...options
  }).format(value)
}

export const formatRelativeTime = (date: Date) => {
  return formatDistanceToNow(date, {
    includeSeconds: true,
    addSuffix: true
  })
}
