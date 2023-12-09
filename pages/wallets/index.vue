<script lang="ts" setup>
const { data: accounts } = await useAccounts()

// const account = computed(() => {
//   return _accounts.value?.[0]
// })

const count = ref(1)

// // for count, clone that many account objects from account computed
// const _accounts = computed<AccountWithWallet[]>(() => {
//   return Array.from({ length: count.value }, () => account.value)
// })
</script>

<template>
  <div>
    <URange v-model="count" name="range" :min="0" :max="10" color="gray" class="mb-8" />

    <section class="grid accounts-grid gap-6 h-full">
      <WalletAccountCard
        v-for="account in accounts"
        :key="account.id"
        class="aspect-square"
        :account="account"
      />
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.accounts-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  /* grid-template-columns: 1fr 1fr 1fr; */
}
</style>
