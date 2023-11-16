<script lang="ts" setup>
defineProps<{
  walletId: string
}>()
</script>

<template>
  <div class="grid grid-cols-[230px_1fr] h-full">
    <SidebarWalletAccounts
      :wallet-id="walletId"
    />
    <div class="h-full p-6">
      <slot />
    </div>
  </div>
</template>
