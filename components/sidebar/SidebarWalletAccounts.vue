<script lang="ts" setup>
const props = defineProps<{
  wallet: Wallet
}>()

const { data: wallet } = await useWallet(props.wallet.id)

const accountItems = computed(() => {
  return wallet.value?.accounts.map((account) => ({
    label: account.name,
    index: getAccountIndexFromDerivationPath(account.derivationPath),
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
    <div v-if="wallet" class="space-y-6">
      <section>
        <ULink
          :to="{
            name: 'wallets-walletId',
            params: {
              walletId: wallet.id
            }
          }"
        >
          <h2 class="font-bold">
            {{ wallet.name }}
          </h2>
        </ULink>
      </section>

      <menu class="space-y-8">
        <SidebarMainSection
          :links="accountItems"
          title="Accounts"
        />

        <UButton
          color="gray"
          variant="solid"
          block
          size="xs"
          :to="{
            name: 'wallets-walletId-new',
            params: {
              walletId: wallet.id
            }
          }"
        >
          Add account
        </UButton>
      </menu>
    </div>
  </SidebarBase>
</template>
