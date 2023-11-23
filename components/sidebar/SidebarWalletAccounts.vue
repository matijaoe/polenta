<script lang="ts" setup>
import type { Wallet } from '~/server/db/schema'

const props = defineProps<{
  wallet: Wallet
}>()

const { data: wallet } = await useWallet(props.wallet.id)

const accountItems = computed(() => {
  return wallet.value?.accounts.map((account) => ({
    label: account.name,
    click: () => {
      navigateTo({
        name: 'wallets-walletId-accountId',
        params: {
          accountId: account.id,
          walletId: account.walletId,
        }
      })
    }
  })) ?? []
})
</script>

<template>
  <SidebarBase>
    <div class="space-y-6">
      <section>
        <h2 class="font-bold">
          {{ wallet.name }}
        </h2>
      </section>

      <menu class="space-y-8">
        <SidebarMainSection :links="accountItems" title="Accounts" />
      </menu>
    </div>
  </SidebarBase>
</template>
