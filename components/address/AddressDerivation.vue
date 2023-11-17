<script lang="ts" setup>
import type { AddressOptionalStatsResponse } from '~/models'

const key = ref('')
const keyBuffer = ref(key.value)
const isXpubDefined = computed(() => key.value !== '')

const nuxtApp = useNuxtApp()
const {
  data: addressesResponse,
  pending: addressesPending,
  error: invalidXpub
} = await useFetch<{ addresses: string[]; xpub: string }>(() => `/api/xpub/${key.value}`, {
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

const rows = computed(() => {
  return addressStatsArr.value.map((addrData) => {
    return {
      address: addrData.address,
      balance: `${formatNumber(addrData.stats?.balance ?? 0)} sats`,
      txCount: addrData.stats?.txCount ?? 0,
    }
  })
})

type AddressRow = typeof rows.value[0]

const columns = ref([{
  key: 'address',
  label: 'Address',
}, {
  key: 'balance',
  label: 'Balance',
}, {
  key: 'txCount',
  label: 'Tx',
}])

const navigateToBlockExplorer = (row: AddressRow) => {
  const url = blockExplorerAddressUrl(row.address)
  navigateTo(url, { external: true, open: { target: '_blank' } })
}

const onKeySubmit = () => {
  key.value = keyBuffer.value
}
</script>

<template>
  <pre class="text-blue-300">{{ nuxtApp.payload }}</pre>
  <pre class="text-orange-300">{{ nuxtApp.static }}</pre>
  <form @submit.prevent="onKeySubmit">
    <UFormGroup label="XPUB" :error="invalidXpub ? 'Invalid xpub' : undefined">
      <div class="flex items-center gap-4">
        <UInput v-model="keyBuffer" size="lg" type="text" class="w-full" placeholder="xpub" />
        <UButton size="lg" type="submit" :loading="isLoading">
          derive addresses
        </UButton>
      </div>
    </UFormGroup>
  </form>

  <div>
    <UTable
      :rows="rows"
      :columns="columns"
      :loading="isLoading"
      @select="navigateToBlockExplorer"
    />
  </div>
</template>
