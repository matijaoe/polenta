<script lang="ts" setup>
const { data: accounts } = await useAccounts()
</script>

<template>
  <div>
    <section class="grid accounts-grid gap-4 h-full">
      <UCard
        v-for="account in accounts"
        :key="account.id"
        class="group"
        :ui="{
          header: {
            padding: 0
          }
        }"
      >
        <template #header>
          <NuxtLink :to="`/wallets/${account.id}`">
            <div class="flex items-center justify-between px-4 py-5 sm:px-6 hover:bg-gray-50 dark:hover:bg-gray-800/25">
              <h3 variant="link">
                {{ account.name }}
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-500">
                [{{ account.wallet.name }}]
              </p>
            </div>
          </NuxtLink>
        </template>

        {{ formatXpub(account.xpub) }}
      </UCard>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.accounts-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}
</style>
