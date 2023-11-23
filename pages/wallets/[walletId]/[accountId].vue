<script lang="ts" setup>
const route = useRoute('wallets-walletId-accountId')
const accountId = computed(() => route.params.accountId)

const { account, wallet } = await useAccount(accountId)

const useFetchAddresses = (query: Record<string, any>) => useFetch(`/api/xpub/${account.value?.xpub}`, {
  pick: ['addresses', 'type'],
  query
})
const { data: addressesReceivingRes } = await useFetchAddresses({ type: 'receiving', limit: 10 })
const { data: addressesChangeRes } = await useFetchAddresses({ type: 'change', limit: 5 })

onMounted(() => {
  console.log('mounted, acc id', accountId.value)
})
</script>

<template>
  <div v-if="account && wallet">
    <div class="prose dark:prose-invert">
      <h3>{{ account.name }}</h3>
      <h4>{{ formatXpub(account.xpub) }}</h4>
      <h4>{{ account.fingerprint }}</h4>

      <div v-if="addressesReceivingRes?.addresses">
        <h4>Receiving addresses:</h4>
        <ul>
          <li v-for="address in addressesReceivingRes?.addresses" :key="address">
            {{ address }}
          </li>
        </ul>
      </div>

      <div v-if="addressesChangeRes?.addresses">
        <h4>Change addresses:</h4>
        <ul>
          <li v-for="address in addressesChangeRes?.addresses" :key="address">
            {{ address }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
