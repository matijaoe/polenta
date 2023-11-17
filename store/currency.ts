import { defineStore } from 'pinia'
import type { Currency } from '~/models'

export const useCurrencyStore = defineStore('currency', () => {
  const currencies = ref<Currency[]>(['USD', 'EUR', 'GBP'])
  const currency = ref<Currency>('USD')

  const setCurrency = (newCurrency: Currency) => {
    currency.value = newCurrency
  }
  const getCurrency = computed(() => currency.value)

  return {
    currencies,
    currency,
    setCurrency,
    getCurrency,
  }
})
