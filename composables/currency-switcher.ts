import type { Currency } from '~/models'

export const useCurrencySwitcher = () => {
  const currencyStore = useCurrencyStore()

  const shownCurrency = ref<Currency>(currencyStore.currency)

  watch(() => currencyStore.currency, (newCurrency) => {
    set(shownCurrency, newCurrency)
  })

  const cycleShownCurrency = () => {
    const { currencies } = currencyStore
    const index = currencies.indexOf(shownCurrency.value)
    const nextIndex = (index + 1) % currencies.length

    const nextCurrency = currencies.at(nextIndex) ?? 'USD'
    set(shownCurrency, nextCurrency)
  }

  return {
    shownCurrency,
    cycleShownCurrency,
  }
}

export const useSharedCurrencySwitcher = createSharedComposable(useCurrencySwitcher)
