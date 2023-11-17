export const useFormatCurrency = (value: MaybeRef<number>, options?: Intl.NumberFormatOptions) => {
  const { currency } = storeToRefs(useCurrencyStore())
  return computed(() => formatCurrency(unref(value), {
    currency: currency.value,
    ...options,
  }))
}
