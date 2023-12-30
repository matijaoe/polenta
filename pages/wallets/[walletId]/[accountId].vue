<script lang="ts" setup>
import { toNumber } from 'utilipea'

import type { XpubAddressesResponse } from '~/models'

const route = useRoute('wallets-walletId-accountId')
const accountId = computed(() => toNumber(route.params.accountId)!)

const { data: account } = await useAccount(accountId)

const useFetchAddresses = (query: Record<string, any>) => useFetch<XpubAddressesResponse>(`/api/xpub/${account.value?.xpub}`, {
  key: FetchKey.AccountAddresses(account.value!.id),
  pick: ['addresses', 'type'],
  query,
  getCachedData
})
const { data: addressesReceivingRes } = await useFetchAddresses({ type: 'receiving', limit: 10 })
const { data: addressesChangeRes } = await useFetchAddresses({ type: 'change', limit: 5 })
</script>

<template>
  <div v-if="account">
    <div class="space-y-8">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-2xl font-medium">
            {{ account.name }}
          </h2>
          <h4 class="font-mono mt-2">
            {{ formatXpub(account.xpub) }}
          </h4>
        </div>

        <UBadge variant="subtle" size="lg">
          {{ account.fingerprint }}
        </UBadge>
      </div>

      <p>{{ account.derivationPath }}</p>

      <UCard v-if="addressesReceivingRes?.addresses">
        <template #header>
          <h4>Receiving addresses:</h4>
        </template>

        <ul>
          <li v-for="address in addressesReceivingRes?.addresses" :key="address.address!" class="py-1 text-sm">
            {{ address.address }}
          </li>
        </ul>
      </UCard>

      <UCard v-if="addressesChangeRes?.addresses">
        <template #header>
          <h4>Change addresses:</h4>
        </template>

        <ul>
          <li v-for="address in addressesChangeRes?.addresses" :key="address.address!" class="py-1 text-sm">
            {{ address.address }}
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>
