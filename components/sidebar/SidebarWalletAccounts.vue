<script lang="ts" setup>
const { walletId } = defineProps<{
  walletId: string
}>()

const accountsStore = useAccountsStore()

const accounts = computed(() => {
  const walletAccounts = accountsStore.getWalletAccounts(walletId)

  return walletAccounts.map(account => ({
    label: account.label,
    // badge: SCRIPT_CONFIG[account.scriptType].label.toLowerCase(),
    click: () => {
      navigateTo({
        name: 'wallets-walletId-accountId',
        params: {
          walletId: account.walletId,
          accountId: account.id
        },
      })
    }
  }))
})
</script>

<template>
  <SidebarBase>
    <menu class="space-y-8">
      <section>
        <div>
          <h2 class="font-bold">
            Accounts
          </h2>
        </div>

        <UVerticalNavigation :links="accounts" class="-mx-3 mt-2" />
      </section>
    </menu>
  </SidebarBase>
</template>
