<script lang="ts" setup>
const route = useRoute('wallets-walletId')
const walletId = computed(() => route.params.walletId)
</script>

<template>
  <LayoutBase>
    <div class="grid grid-cols-[230px_1fr] h-full">
      <SidebarWalletAccounts
        :wallet-id="walletId"
      />
      <div class="h-full p-6">
        <slot />
      </div>
    </div>
  </LayoutBase>
</template>

<style lang="postcss" scoped>
.container-height {
  height: calc(100vh - var(--footer-height) - var(--header-height));
}
</style>
