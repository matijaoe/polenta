<script lang="ts" setup>
const route = useRoute()
const walletId = computed(() => (route.params as { walletId: string }).walletId)

const walletsStore = useWalletsStore()

const wallet = computed(() => walletsStore.getWallet(walletId.value))
</script>

<template>
  <div v-if="wallet">
    <div class="space-y-4">
      <h2 class="text-3xl">
        {{ wallet.label }}
      </h2>
    </div>
  </div>
</template>
