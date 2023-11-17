export const formatCurrency = (value: number, options?: Intl.NumberFormatOptions) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    ...options
  }).format(value)
}

export const useFormatCurrency = (value: MaybeRef<number>, options?: Intl.NumberFormatOptions) => {
  const { currency } = storeToRefs(useCurrencyStore())
  return computed(() => formatCurrency(unref(value), {
    currency: currency.value,
    ...options,
  }))
}
