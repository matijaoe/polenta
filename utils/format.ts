import { formatDistanceToNow } from 'date-fns'

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

export const formatCurrency = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('en-US', {
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
