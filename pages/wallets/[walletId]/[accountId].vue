<script lang="ts" setup>
const route = useRoute()
const accountId = computed(() => (route.params as { accountId: string }).accountId)

const accountsStore = useAccountsStore()

const account = computed(() => accountsStore.getAccount(accountId.value))

definePageMeta({
  layout: 'dual',
})
</script>

<template>
  <SidebarWalletAccountWrapper
    v-if="account"
    :wallet-id="account.walletId"
  >
    <div class="space-y-4">
      <UBadge>{{ account.scriptType }}</UBadge>

      <h2 class="text-3xl">
        {{ account.label }}
      </h2>
    </div>
  </SidebarWalletAccountWrapper>
</template>
