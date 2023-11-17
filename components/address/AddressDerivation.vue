<script lang="ts" setup>
import type { AddressOptionalStatsResponse } from '~/models'

const xpub = ref('')
const xpubBuffer = ref(xpub.value)
const isXpubDefined = computed(() => xpub.value !== '')

const nuxtApp = useNuxtApp()
const {
  data: addressesResponse,
  pending: addressesPending,
  error: invalidXpub,
} = await useFetch<{ addresses: string[]; xpub: string }>(() => `/api/xpub/${xpub.value}`, {
  pick: ['addresses'],
  immediate: isXpubDefined.value,
  getCachedData(key) {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }
})

const isLoading = computed(() => {
  return addressesPending.value && isXpubDefined.value
})

const addresses = computed(() => {
  return addressesResponse.value?.addresses ?? []
})

const addressStatsArr = ref<AddressOptionalStatsResponse[]>([])

watchImmediate(addresses, async (newAddresses) => {
  const promises = newAddresses.map(address => $fetch(`/api/address/${address}`))
  try {
    addressStatsArr.value = await Promise.all(promises)
  } catch (err) {
    addressStatsArr.value = newAddresses.map(address => ({ address }))
  }
})

const currencyStore = useCurrencyStore()
const { floatRate } = useExchangeRate(toRef(currencyStore, 'currency'))

const rows = computed(() => {
  return addressStatsArr.value.map((addrData) => {
    return {
      address: addrData.address,
      balance: `${formatNumber(addrData.stats?.balance ?? 0)} sats`,
      txCount: addrData.stats?.txCount ?? 0,
      value: ''
    }
  })
})

const rowsWithValue = computed(() => rows.value.map((row) => {
  if (!floatRate.value) {
    return row
  }

  const addr = addressStatsArr.value.find(addr => addr.address === row.address)
  if (!addr) {
    return row
  }

  const satsBalance = addr.stats?.balance ?? 0
  const btcBalance = satsToBtc(satsBalance) * floatRate.value
  const value = useFormatCurrency(btcBalance, { maximumFractionDigits: 0 }).value

  return { ...row, value }
}))

const totalSats = computed(() => {
  return rowsWithValue.value.reduce((acc, row) => {
    const satsBalance = addressStatsArr.value.find(addr => addr.address === row.address)?.stats?.balance ?? 0
    return acc + satsBalance
  }, 0)
})

const satsFormatStyle = ref<'sats' | 'btc'>('sats')
const totalSatsFormatted = computed(() => {
  if (satsFormatStyle.value === 'btc') {
    return `₿${formatNumber(satsToBtc(totalSats.value), {
      maximumFractionDigits: 8,
    })}`
  }
  return `${formatNumber(totalSats.value)} sats`
})
const toggleSatsFormatStyle = () => {
  satsFormatStyle.value = satsFormatStyle.value === 'sats' ? 'btc' : 'sats'
}

const totalValue = computed(() => {
  if (!floatRate.value) {
    return 0
  }

  return satsToBtc(totalSats.value) * floatRate.value
})

const totalValueFormatted = computed(() => {
  return useFormatCurrency(totalValue.value, { maximumFractionDigits: 2, minimumFractionDigits: 2 }).value
})

type AddressRow = typeof rows.value[0]

const columns = ref([
  {
    key: 'address',
    label: 'Address',
  },
  {
    key: 'balance',
    label: 'Balance',
  },
  {
    key: 'value',
    label: 'value'
  },
  {
    key: 'txCount',
    label: 'Tx',
  }
])

const navigateToBlockExplorer = (row: AddressRow) => {
  const url = blockExplorerAddressUrl(row.address)
  navigateTo(url, { external: true, open: { target: '_blank' } })
}

const onKeySubmit = () => {
  xpub.value = xpubBuffer.value
}
</script>

<template>
  <div class="space-y-8">
    <form @submit.prevent="onKeySubmit">
      <UFormGroup label="XPUB" :error="invalidXpub ? 'Invalid xpub' : undefined">
        <div class="flex items-center gap-4">
          <template v-if="isXpubDefined">
            <UInput :value="xpub" size="lg" type="text" class="w-full" readonly />
            <UButton size="lg" type="submit" :loading="isLoading">
              new
            </UButton>
          </template>

          <template v-else>
            <UInput v-model="xpubBuffer" size="lg" type="text" class="w-full" placeholder="xpub" />
            <UButton size="lg" type="submit" :loading="isLoading">
              derive addresses
            </UButton>
          </template>
        </div>
      </UFormGroup>
    </form>

    <UCard>
      <div class="flex items-center justify-between gap-3">
        <button @click="toggleSatsFormatStyle">
          <p class="text-2xl font-bold">
            {{ totalSatsFormatted }}
          </p>
        </button>

        <p class="text-2xl font-bold">
          {{ totalValueFormatted }}
        </p>
      </div>
    </UCard>

    <UTable
      :rows="rowsWithValue"
      :columns="columns"
      :loading="isLoading"
      @select="navigateToBlockExplorer"
    />
  </div>
</template>
