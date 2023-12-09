<script lang="ts" setup>
const route = useRoute('wallets-walletId')
const walletId = computed(() => Number.parseInt(route.params.walletId))

const { data: wallet } = await useWallet(walletId)

definePageMeta({
  layout: false
})
</script>

<template>
  <NuxtLayout name="dual-sidebar" :wallet="wallet">
    <div v-if="wallet" class="text-xl">
      {{ wallet.name }} (id = {{ wallet.id }})
    </div>

    <UCard class="mt-5">
      <NuxtPage :foobar="123" />
    </UCard>
  </NuxtLayout>
</template>
