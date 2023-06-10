<script lang="ts" setup>
import type { AddressBalance, AddressBasic } from '~/models'

const key = ref('xpub6Ea8xeCW1XVEf9qTggAkUHrK4tJPAcPo7Y3EwodMazzMwXzga6e4Fbg7sp1NwvdhtbvANjyrBXHCWUjeqBARthg2fhBh7WCGWVquBVNxP2C')
const keyBuffer = ref(key.value)

const { data: addresses, pending: addressesPending } = await useFetch<AddressBasic[]>(() => `/api/addresses/${key.value}`)
const rawAddresses = computed(() => addresses.value?.map(address => address.address) ?? [])

const balances = ref<Record<string, AddressBalance>>({})

const addressesWithBalances = computed(() => {
  return addresses.value?.map(address => ({
    ...address,
    balance: balances.value?.[address.address] ?? null,
  })) ?? []
})

async function fetchBalances() {
  const addresses = rawAddresses.value
  if (!addresses.length)
    return {}

  const url = new URL('https://blockchain.info/balance')
  url.searchParams.set('active', addresses.join('|'))

  try {
    const res = await $fetch<Record<string, AddressBalance>>(url.href)
    return res as Record<string, AddressBalance>
  } catch (error) {
    console.error(error)
    return {}
  }
}

whenever(rawAddresses, async () => {
  balances.value = await fetchBalances() ?? {}
}, { immediate: true })

function onKeySubmit() {
  key.value = keyBuffer.value
}
</script>

<template>
  <form @submit.prevent="onKeySubmit">
    <div class="flex items-center gap-4">
      <UInput
        v-model="keyBuffer"
        size="xl"
        type="text"
        class="w-full"
      />
      <UButton
        size="xl"
        type="submit"
        :loading="addressesPending"
      >
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
