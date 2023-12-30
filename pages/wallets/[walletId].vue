<script lang="ts" setup>
import { toNumber } from 'utilipea'

const route = useRoute('wallets-walletId')
const walletId = computed(() => toNumber(route.params.walletId))

const { data: wallet } = await useWallet(walletId.value!)

definePageMeta({
  layout: false
})
</script>

<template>
  <NuxtLayout v-if="wallet" name="dual-sidebar" :wallet>
    <div class="flex items-center gap-8 justify-between">
      <h1 class="font-bold text-2xl">
        {{ wallet.name }}
      </h1>
      <p>{{ wallet.accounts.length }} accounts</p>
    </div>

    <UCard class="mt-5">
      <NuxtPage :foobar="123" />
    </UCard>
  </NuxtLayout>
</template>
