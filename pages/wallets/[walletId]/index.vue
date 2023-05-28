<script lang="ts" setup>
const route = useRoute()
const walletId = computed(() => (route.params as { walletId: string }).walletId)

const walletsStore = useWalletsStore()

const wallet = computed(() => walletsStore.getWallet(walletId.value))

definePageMeta({
  layout: 'dual',
})
</script>

<template>
  <SidebarWalletAccountWrapper
    v-if="wallet"
    :wallet-id="wallet.id"
  >
    <div class="space-y-4">
      <h2 class="text-3xl">
        {{ wallet.label }}
      </h2>
    </div>
  </SidebarWalletAccountWrapper>
</template>
