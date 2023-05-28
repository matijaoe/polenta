<script lang="ts" setup>
const { walletId } = defineProps<{
  walletId: string
}>()

const accountsStore = useAccountsStore()

const accounts = computed(() => {
  const walletAccounts = accountsStore.getAccountWallets(walletId)
  return walletAccounts.map(account => ({
    label: account.label,
    to: {
      name: 'wallets-walletId-accountId',
      params: { walletId: account.walletId, accountId: account.id },
    },
  }))
})
</script>

<template>
  <aside class="border-r border-gray-200 dark:border-gray-700 px-5 py-8 pb-14">
    <menu>
      <div class="mt-8 space-y-8">
        <section>
          <div>
            <h2 class="font-bold">
              Accounts
            </h2>
            <p class="text-xs text-gray-400 dark:text-gray-600">
              Tied to wallets
            </p>
          </div>
          <UVerticalNavigation
            :links="accounts"
            class="-mx-3 mt-2"
          />
        </section>
      </div>
    </menu>
  </aside>
</template>
