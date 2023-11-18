<script lang="ts" setup>
import type { AddressOptionalStatsResponse, XpubAddressesResponse } from '~/models'

const xpub = useState(() => '')
const xpubBuffer = ref(xpub.value)
const isXpubDefined = computed(() => xpub.value !== '')

const nuxtApp = useNuxtApp()

const {
  data: addressesResponse,
  pending: addressesPending,
  error: invalidXpub,
  refresh: fetchXpubAddresses
} = await useFetch<XpubAddressesResponse>(() => `/api/xpub/${xpub.value}`, {
  immediate: isXpubDefined.value,
  // do not fetch when xpub is empty on clicking new xpub input
  watch: false,
  getCachedData(key) {
    const cache = retrieveCached<XpubAddressesResponse>(key)
    const cachedXpubMatchesCurrent = cache?.xpub === xpub.value
    if (cachedXpubMatchesCurrent) {
      return cache as any
    }
    return null
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

const setPayloadData = (key: string, value: any) => {
  nuxtApp.payload.data[key] = value
  nuxtApp.static.data[key] = value
}

const buildXpubStatsKey = (xpub: string) => `${xpub}_stats`
const getCachedAddrStats = () => {
  const key = buildXpubStatsKey(xpub.value)
  return retrieveCached(key)
}

const isRefetchStatsRequested = ref(false)
const { data: _addressStatsRes, refresh: _refetchAddressStats } = await useAsyncData<AddressOptionalStatsResponse[]>(async () => {
  if (!isRefetchStatsRequested.value) {
    const cached = getCachedAddrStats()
    if (cached) {
      return cached
    }
  }

  const promises = addresses.value.map(address => $fetch(`/api/address/${address}`))

  try {
    return await Promise.all(promises)
  } catch (err) {
    return addresses.value.map(address => ({ address }))
  }
}, {
  watch: [addresses],
  getCachedData() {
    return getCachedAddrStats()
  },
})

const refetchAddressStats = () => {
  set(isRefetchStatsRequested, true)
  _refetchAddressStats()
  set(isRefetchStatsRequested, false)
}

whenever(_addressStatsRes, (newRes) => {
  if (!newRes || !xpub.value) {
    return
  }
  const keyStats = buildXpubStatsKey(xpub.value)
  setPayloadData(keyStats, newRes)
})

const addressStatsArr = computed(() => {
  return _addressStatsRes.value ?? []
})

const { shownCurrency, cycleShownCurrency } = useSharedCurrencySwitcher()
const { floatRate } = useExchangeRate(shownCurrency)

const rows = computed(() => {
  return addressStatsArr.value.map(({ address, stats }) => {
    return {
      key: address,
      address,
      balance: `${formatNumber(stats?.balance ?? 0)} sats`,
      txCount: stats?.txCount ?? 0,
      value: ''
    }
  })
})

const rowsWithValue = computed(() => {
  if (!floatRate.value) {
    return rows.value
  }
  return rows.value.map((row) => {
    const addr = addressStatsArr.value.find(addr => addr.address === row.address)
    if (!addr) {
      return row
    }

    const satsBalance = addr.stats?.balance ?? 0
    const btcBalance = satsToBtc(satsBalance) * floatRate.value!
    const value = formatCurrency(btcBalance, {
      currency: shownCurrency.value,
      maximumFractionDigits: 2
    })

    return { ...row, value }
  })
})

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

const assignXpub = () => {
  const isValidFormat = validateXpub(xpubBuffer.value)
  if (isValidFormat) {
    set(xpub, xpubBuffer.value)
  }
}

const xpubInputEl = ref<HTMLInputElement | null>(null)

watch(xpub, (newXpub) => {
  if (newXpub !== xpubBuffer.value) {
    set(xpubBuffer, newXpub)
  }
  if (newXpub) {
    fetchXpubAddresses()
  }
})

const setNewXpubInput = () => {
  set(xpub, '')
  // TODO: focus input
  // TODO: somehow clear addresses so on new xpub submit there wont be a split second of old addresses and balances
}

const isXpubValueInvalid = computed(() => {
  if (xpubBuffer.value && !validateXpub(xpubBuffer.value)) {
    return true
  }
  // TODO: something aint right
  if (invalidXpub.value && !xpubBuffer.value) {
    return true
  }

  return false
})
</script>

<template>
  <div class="space-y-8">
    <form @submit.prevent="assignXpub">
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
            <UButton
              size="lg"
              variant="outline"
              type="button"
              @click="refetchAddressStats()"
            >
              refetch stats
            </UButton>
            <UButton
              size="lg"
              type="submit"
              @click="setNewXpubInput"
            >
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

        <AddressTable
          class="mt-4"
          :rows="rowsWithValue"
          :loading="areAddressesLoading"
        />
      </UCard>
    </template>
  </div>
</template>
