<script lang="ts" setup>
import type { AddressOptionalStatsResponse } from '~/models'

const xpub = useState(() => '')
const xpubBuffer = ref(xpub.value)
const isXpubDefined = computed(() => xpub.value !== '')

const { data: xpubAddressesCached } = useNuxtData<{ xpub: string; addresses: string[] }>('xpub_addresses')
const currentXpubMatchesCached = computed(() => {
  const areBothDefined = isXpubDefined.value && xpubAddressesCached.value?.xpub
  return areBothDefined && xpubAddressesCached.value?.xpub === xpub.value
})

const nuxtApp = useNuxtApp()
const {
  data: addressesResponse,
  pending: addressesPending,
  error: invalidXpub,
  refresh: fetchXpubAddresses
} = await useFetch<{ addresses: string[]; xpub: string }>(() => `/api/xpub/${xpub.value}`, {
  key: `xpub_addresses`,
  immediate: isXpubDefined.value,
  // do not fetch when xpub is empty on clicking new xpub input
  watch: false,
  getCachedData(key) {
    const cache = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    if (cache?.xpub === xpub.value) {
      return cache
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

const addressStatsArr = ref<AddressOptionalStatsResponse[]>([])

const addPayloadData = (key: string, value: any) => {
  nuxtApp.payload.data[key] = value
  nuxtApp.static.data[key] = value
}

const fetchAddressBalances = async (addresses: string[]) => {
  const promises = addresses.map(address => $fetch(`/api/address/${address}`))

  type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
  type FetchedType = Awaited<typeof promises[0]>
  let res: WithOptional<FetchedType, 'stats'>[] = []

  try {
    res = await Promise.all(promises)
  } catch (err) {
    res = addresses.map(address => ({ address }))
  }

  return res
}

const ensureAddressStats = async (addresses: string[]) => {
  const res = await fetchAddressBalances(addresses)
  set(addressStatsArr, res)
  if (xpub.value) {
    addPayloadData(`${xpub.value}_balances`, addresses)
  }
}

watchImmediate(addresses, async (newAddresses) => {
  if (currentXpubMatchesCached.value) {
    const keyBalances = `${xpubAddressesCached.value!.xpub}_balances`
    const cached = nuxtApp.payload.data[keyBalances] || nuxtApp.static.data[keyBalances]
    if (cached) {
      set(addressStatsArr, cached)
      return
    }
  }

  ensureAddressStats(newAddresses)
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
              @click="ensureAddressStats(addresses)"
            >
              refetch balances
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
