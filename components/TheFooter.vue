<script lang="ts" setup>
import type { BitcoinPriceResponseModelCurrencyKey } from '~/models'

const { data: exchangeRateResponse, pending: isRatePending } = await useFetch('/api/exchange-rate', {
  lazy: true,
  pick: ['bpi', 'time'],
})

const currencies: BitcoinPriceResponseModelCurrencyKey[] = ['USD', 'EUR', 'GBP']
const selectedCurrency = ref<BitcoinPriceResponseModelCurrencyKey>('USD')

const cycleCurrency = () => {
  const index = currencies.indexOf(selectedCurrency.value)
  const nextIndex = (index + 1) % currencies.length
  selectedCurrency.value = currencies[nextIndex]
}

const formattedExchangeRate = computed(() => {
  if (!exchangeRateResponse.value?.bpi) {
    return null
  }

  const price = exchangeRateResponse.value.bpi?.[selectedCurrency.value].rate_float

  if (!price) {
    return null
  }

  return formatCurrency(price, {
    currency: selectedCurrency.value,
    unitDisplay: 'short',
    maximumFractionDigits: 0,
  })
})
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 text-xs px-2 py-1 h-[25px]">
    <div class="flex items-center justify-between">
      <button
        v-if="formattedExchangeRate"
        class="text-left flex items-center gap-1"
        @click="cycleCurrency"
      >
        <span>1 BTC</span>
        <span> = </span>
        <USkeleton v-if="isRatePending" class="h-4 w-[70px]" />
        <span v-else>{{ formattedExchangeRate }}</span>
      </button>

      <div>
        connected to blockstream.info
      </div>
    </div>
  </footer>
</template>
