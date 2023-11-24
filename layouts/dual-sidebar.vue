<script lang="ts" setup>
import type { Wallet } from '~/server/db/schema'

defineProps<{
  wallet: Wallet
}>()
</script>

<template>
  <LayoutBase no-padding>
    <div class="content-container-height grid grid-cols-[200px_1fr]">
      <SidebarWalletAccounts :wallet="wallet" />
      <div class="h-full p-6 overflow-y-scroll">
        <slot />
      </div>
    </div>
  </LayoutBase>
</template>
