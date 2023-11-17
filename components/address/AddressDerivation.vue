<script lang="ts" setup>
import type { AddressOptionalStatsResponse, AddressStats } from '~/models'

const key = ref('')
const keyBuffer = ref(key.value)

const { data: addressesResponse, pending: addressesPending, error: invalidXpub } = await useFetch<{ addresses: string[]; xpub: string }>(() => `/api/addresses/${key.value}`, {
  pick: ['addresses'],
  immediate: key.value !== '',
})

const isLoading = computed(() => {
  return addressesPending.value && key.value !== ''
})

const addresses = computed(() => {
  return addressesResponse.value?.addresses ?? []
})

const addressStatsArr = ref<AddressOptionalStatsResponse[]>([])

whenever(addresses, async (newAddresses) => {
  // for every address in _adresses, fetch the stats and fdill out address stats arr, but do it with Promise.all, using $fetch
  const promises = newAddresses.map(address => $fetch(`/api/address/${address}`))
  try {
    const addressStats = await Promise.all(promises)
    addressStatsArr.value = addressStats
  } catch (err) {
    addressStatsArr.value = newAddresses.map(address => ({ address }))
  }
}, { immediate: true })

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US').format(value)
}

const blockExplorerUrl = (address: string) => {
  const blockExplorer = 'https://mempool.space/address'
  return `${blockExplorer}/${address}`
}

const onKeySubmit = () => {
  key.value = keyBuffer.value
}
</script>

<template>
  <form @submit.prevent="onKeySubmit">
    <h1 class="mb-4 text-xl">
      Derive addresses
    </h1>

    <UFormGroup label="XPUB" :error="invalidXpub ? 'Invalid xpub' : undefined">
      <div class="flex items-center gap-4">
        <UInput v-model="keyBuffer" size="xl" type="text" class="w-full" placeholder="xpub" />
        <UButton size="xl" type="submit" :loading="isLoading">
          submit
        </UButton>
      </div>
    </UFormGroup>
  </form>

  <div v-if="addressStatsArr" class="mt-4">
    <div v-for="addrData in addressStatsArr" :key="addrData.address" class="py-2 text-base font-mono">
      <UTooltip text="See on block explorer" :popper="{ placement: 'left' }">
        <NuxtLink :to="blockExplorerUrl(addrData.address)" external target="_blank" class="hover:text-primary">
          {{ addrData.address }}
        </NuxtLink>
      </UTooltip>
      <template v-if="addrData.stats">
        - {{ formatNumber(addrData.stats?.balance ?? 0) }} sats
      </template>
    </div>
  </div>
</template>
