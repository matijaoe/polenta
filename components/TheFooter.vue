<script lang="ts" setup>
import type { BitcoinPriceResponseModel } from '~/models'

const price = ref(0)

async function fetchPrice() {
  const data = await fetch('https://api.coindesk.com/v1/bpi/currentprice.json')
    .then(res => res.json() as Promise<BitcoinPriceResponseModel>)
  price.value = data?.bpi?.USD?.rate_float ?? null
}

fetchPrice()
</script>

<template>
  <footer class="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700 text-xs px-2 py-1 h-[25px]">
    <div class="flex items-center justify-between">
      <div v-if="price != null">
        1 BTC = {{ new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          unitDisplay: 'short',
          maximumFractionDigits: 0,
        }).format(price) }}
      </div>
      <div>
        connected to blockstream.info
      </div>
    </div>
  </footer>
</template>
