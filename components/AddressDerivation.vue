<script lang="ts" setup>
const key = ref('xpub6CZX84QLwBy1Pneo2LLdiugUVSa679XHYKST22SC6mPduSUD6YoDc14Ze2KPPCdNz3oEfGgbpA8H1KGbS3VMWRxoUsq1TZDjBEejrPeUQmG')
const localKey = ref(key.value)

const { data, pending } = await useFetch(() => `/api/adresses/${key.value}`)

type BlockchainAddressInfo = { final_balance: string; n_tx: string; total_received: string }
const addressesBalances = ref<Record<string, BlockchainAddressInfo>>({})

function fetchAddressesBalances(list: string[]) {
  const url = new URL('https://blockchain.info/balance')
  url.searchParams.set('active', list.join('|'))

  const res = $fetch<Record<string, BlockchainAddressInfo>>(url.href)
  console.log('🤑', res)
  return res
}

watch(data, async (addresses) => {
  const rawAddresses = addresses?.map(address => address.address) ?? []
  addressesBalances.value = await fetchAddressesBalances(rawAddresses)
}, { immediate: true })

const addresses = computed(() => {
  const addresses = data.value ?? []
  return addresses.map(address => ({
    ...address,
    balance: addressesBalances.value[address.address]?.final_balance ?? null,
  }))
})

function setXpub() {
  key.value = localKey.value
}
</script>

<template>
  <form class="mb-5 flex flex-col items-start gap-4" @submit.prevent="setXpub">
    <UInput v-model="localKey" type="text" class="w-full" />
    <UButton type="submit" :loading="pending">
      submit
    </UButton>
  </form>

  <template v-if="data">
    <div v-for="address in addresses" :key="address.address" class="py-2 text-sm">
      {{ address.address }} - {{ address.balance }} sats
    </div>
  </template>
</template>
