<script lang="ts" setup>
defineProps<{
  wallet: Wallet
}>()
</script>

<template>
  <LayoutBase no-padding>
    <div class="content-container-height grid grid-cols-[200px_1fr]">
      <SidebarWalletAccounts :wallet />
      <div class="h-full p-6 overflow-y-scroll">
        <slot />
      </div>
    </div>
  </LayoutBase>
</template>
