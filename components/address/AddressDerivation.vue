<script lang="ts" setup>
import type { AddressBalance } from '~/models'

const key = ref('')
const keyBuffer = ref(key.value)

const { data: addressesResponse, pending: addressesPending } = await useFetch<{ addresses: string[]; xpub: string }>(() => `/api/addresses/${key.value}`, {
  pick: ['addresses'],
  immediate: false,
})

const addresses = computed(() => {
  return addressesResponse.value?.addresses ?? []
})

const balances = ref<Record<string, AddressBalance>>({})

const addressesWithBalances = computed(() => {
  return addresses.value.map(address => ({
    address,
    balance: balances.value?.[address] ?? null,
  })) ?? []
})

const fetchBalances = async () => {
  if (!addresses.value?.length) {
    return {}
  }

  const url = new URL('https://blockchain.info/balance')
  url.searchParams.set('active', addresses.value.join('|'))

  try {
    const res = await $fetch<Record<string, AddressBalance>>(url.href)
    return res as Record<string, AddressBalance>
  } catch (error) {
    console.error(error)
    return {}
  }
}

whenever(addresses, async () => {
  balances.value = await fetchBalances() ?? {}
}, { immediate: true })

function onKeySubmit() {
  key.value = keyBuffer.value
}
</script>

<template>
  <form @submit.prevent="onKeySubmit">
    <div class="flex items-center gap-4">
      <UInput v-model="keyBuffer" size="xl" type="text" class="w-full" />
      <UButton size="xl" type="submit" :loading="addressesPending">
        submit
      </UButton>
    </div>
  </form>

  <div v-if="addressesWithBalances" class="mt-4">
    <div v-for="address in addressesWithBalances" :key="address.address" class="py-2 text-sm">
      {{ address.address }} - {{ address.balance?.final_balance?.toLocaleString() ?? 0 }} sats
    </div>
  </div>
</template>
