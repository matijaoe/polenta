<script lang="ts" setup>
const {
  pending: isRatePending,
  refresh: refreshRate,
} = await useFetch('/api/bitcoin/exchange-rate', {
  lazy: true,
  pick: ['bpi', 'time'],
  key: 'bitcoin-exchange-rate',
})

const REFRESH_RATE_MINUTES = 1
useIntervalFn(() => {
  refreshRate()
}, REFRESH_RATE_MINUTES * 60 * 1000)

const { shownCurrency, cycleShownCurrency } = useSharedCurrencySwitcher()
const { formattedRate, lastUpdatedLabel } = useExchangeRate(shownCurrency)
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
            <button @click="cycleShownCurrency">
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
