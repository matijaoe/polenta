import type { BitcoinPriceResponseModel, BitcoinPriceResponseModelCurrencyKey } from '~/models'

// TODO: store for default user currency/currencies
export const useExchangeRate = (currency: MaybeRef<BitcoinPriceResponseModelCurrencyKey>) => {
  const { data } = useNuxtData<BitcoinPriceResponseModel>('bitcoin-exchange-rate')

  const selectedCurrency = computed(() => unref(currency))

  const floatRate = computed(() => {
    if (!data.value) {
      return null
    }

    return data.value.bpi[selectedCurrency.value].rate_float
  })

  const formattedRate = computed(() => {
    if (!data.value) {
      return ''
    }

    const price = data.value.bpi[selectedCurrency.value].rate_float

    return formatCurrency(price, {
      currency: selectedCurrency.value,
      unitDisplay: 'short',
      maximumFractionDigits: 0,
    })
  })

  const lastUpdated = computed(() => {
    if (!data.value) {
      return ''
    }

    return formatRelativeTime(new Date(data.value.time.updatedISO))
  })
  const lastUpdatedLabel = computed(() => {
    if (!data.value) {
      return ''
    }

    return `Updated ${lastUpdated.value} ago`
  })

  return {
    data,
    floatRate,
    formattedRate,
    lastUpdated,
    lastUpdatedLabel,
  }
}
