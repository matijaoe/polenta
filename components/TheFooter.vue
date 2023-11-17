<script lang="ts" setup>
import type { BitcoinPriceResponseModelCurrencyKey } from '~/models'

const {
  pending: isRatePending,
  refresh: refreshRate,
} = await useFetch('/api/exchange-rate', {
  lazy: true,
  pick: ['bpi', 'time'],
  key: 'bitcoin-exchange-rate',
})

useIntervalFn(() => {
  refreshRate()
}, 2 * 60 * 1000) // refresh every 2 minutes

const currencies: BitcoinPriceResponseModelCurrencyKey[] = ['USD', 'EUR', 'GBP']
const selectedCurrency = ref<BitcoinPriceResponseModelCurrencyKey>('USD')

const cycleCurrency = () => {
  const index = currencies.indexOf(selectedCurrency.value)
  const nextIndex = (index + 1) % currencies.length
  selectedCurrency.value = currencies.at(nextIndex) ?? 'USD'
}

const { formattedRate, lastUpdatedLabel } = useExchangeRate(selectedCurrency)
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 text-xs h-[--footer-height]">
    <div class="flex items-center justify-between">
      <div class="px-2 py-1 flex items-center gap-5">
        <UTooltip :text="lastUpdatedLabel">
          <div class="text-left flex items-center gap-2 font-bold">
            <button
              class="grid place-content-center group text-gray-900 dark:text-primary"
              @click="refreshRate()"
            >
              <i
                class="i-simple-icons-bitcoin text-[15px] group-hover:hidden"
              />
              <i
                :class="{
                  'animate-spin': formattedRate && isRatePending,
                }"
                class="i-ph-arrows-clockwise-bold text-[15px] hidden group-hover:flex"
              />
            </button>
            <button @click="cycleCurrency">
              <USkeleton v-if="isRatePending && !formattedRate" class="h-4 w-[70px]" />
              <span v-else-if="formattedRate">{{ formattedRate }}</span>
            </button>
          </div>
        </UTooltip>
      </div>

      <div class="px-2 py-1">
        connected to blockstream.info
      </div>
    </div>
  </footer>
</template>

<style lang="postcss" scoped>
:global(:root) {
  --footer-height: 25px;
}
</style>
