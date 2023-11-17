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
  key: 'addresses',
  pick: ['addresses'],
  immediate: isXpubDefined.value,
  getCachedData(key) {
    return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  }
})

const areAddressesLoading = computed(() => {
  return addressesPending.value && isXpubDefined.value
})

const addresses = computed(() => {
  return addressesResponse.value?.addresses ?? []
})

const hasAddresses = computed(() => {
  return addresses.value.length > 0
})

const addressStatsArr = ref<AddressOptionalStatsResponse[]>([])

watchImmediate(addresses, async (newAddresses) => {
  const promises = newAddresses.map(address => $fetch(`/api/address/${address}`))
  // This is the type of the resolved Promise

  try {
    addressStatsArr.value = await Promise.all(promises)
  } catch (err) {
    addressStatsArr.value = newAddresses.map(address => ({ address }))
  }
})

const { shownCurrency, cycleShownCurrency } = useSharedCurrencySwitcher()
const { floatRate } = useExchangeRate(shownCurrency)

const rows = computed(() => {
  return addressStatsArr.value.map((addrData) => {
    const { address, stats } = addrData
    return {
      key: address,
      address,
      balance: `${formatNumber(stats?.balance ?? 0)} sats`,
      txCount: stats?.txCount ?? 0,
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
  const value = formatCurrency(btcBalance, {
    currency: shownCurrency.value,
    maximumFractionDigits: 2
  })

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
  const format = satsFormatStyle.value === 'sats' ? 'btc' : 'sats'
  set(satsFormatStyle, format)
}

const totalValue = computed(() => {
  if (!floatRate.value) {
    return 0
  }

  return satsToBtc(totalSats.value) * floatRate.value
})

const totalValueFormatted = computed(() => {
  return formatCurrency(totalValue.value, {
    currency: shownCurrency.value,
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  })
})

const onKeySubmit = () => {
  const isValidFormat = validateXpub(xpubBuffer.value)
  if (!isValidFormat) {
    return
  }
  set(xpub, xpubBuffer.value)
}

watch(xpub, (newXpub) => {
  if (newXpub !== xpubBuffer.value) {
    set(xpubBuffer, newXpub)
  }
})

const xpubInputEl = ref<HTMLInputElement | null>(null)

const setNewXpub = () => {
  set(xpub, '')
  // TODO: not working
  setImmediate(() => {
    xpubInputEl.value?.focus()
  })
}

const isXpubValueInvalid = computed(() => {
  if (xpubBuffer.value && !validateXpub(xpubBuffer.value)) {
    return true
  }
  if (xpubBuffer.value && invalidXpub.value) {
    return true
  }
  return false
})
</script>

<template>
  <div class="space-y-8">
    <form @submit.prevent="onKeySubmit">
      <UFormGroup label="XPUB" :error="isXpubValueInvalid ? 'Invalid xpub' : undefined">
        <div class="flex items-center gap-4">
          <template v-if="!isXpubDefined">
            <UInput ref="xpubInputEl" v-model="xpubBuffer" size="lg" type="text" class="w-full" placeholder="xpub" />
            <UButton size="lg" type="submit" :loading="areAddressesLoading">
              derive addresses
            </UButton>
          </template>

          <template v-else>
            <UInput :value="xpub" size="lg" type="text" class="w-full" readonly />
            <UButton size="lg" type="submit" @click="setNewXpub">
              new
            </UButton>
          </template>
        </div>
      </UFormGroup>
    </form>
    <template v-if="isXpubDefined && hasAddresses">
      <UCard>
        <div class="flex items-center justify-between gap-3">
          <button @click="toggleSatsFormatStyle">
            <p class="text-2xl font-bold">
              {{ totalSatsFormatted }}
            </p>
          </button>

          <button @click="cycleShownCurrency">
            <p class="text-2xl font-bold">
              {{ totalValueFormatted }}
            </p>
          </button>
        </div>

        <AddressTable :rows="rowsWithValue" :loading="areAddressesLoading" />
      </UCard>
    </template>
  </div>
</template>
