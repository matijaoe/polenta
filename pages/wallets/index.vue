<script lang="ts" setup>
const { data: accounts } = await useAccounts()

// group accounts by wallets
const wallets = computed(() => {
  // group accounts by wallet, so that i have a wallet with a list of accounts for it as a map
  const wallets = new Map<number, AccountWithWallet[]>()
  accounts.value?.forEach((account) => {
    const walletId = account.walletId
    const wallet = wallets.get(walletId)
    if (wallet) {
      wallet.push(account)
    } else {
      wallets.set(walletId, [account])
    }
  })
  return wallets
})
</script>

<template>
  <div class="flex flex-col gap-10">
    <section
      v-for="[walletId, walletAccounts] in wallets.entries()"
      :key="walletId"
    >
      <ULink
        class="mb-4 block text-xl"
        :to="{
          name: 'wallets-walletId',
          params: { walletId }
        }"
      >
        {{ wallets.get(walletId)?.[0].wallet.name }}
      </ULink>

      <div class="grid accounts-grid gap-6 h-full">
        <WalletAccountCard
          v-for="account in walletAccounts"
          :key="account.id"
          class="aspect-square"
          :account
        />
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.accounts-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
</style>
