<script lang="ts" setup>
const route = useRoute()
const accountId = computed(() => route.params.accountId)
const accountsStore = useAccountsStore()
const account = computed(() => {
  return accountsStore.accounts.find(account => account.id === accountId.value)
})
</script>

<template>
  <div v-if="account">
    <div class="space-y-4">
      <UBadge>{{ account.scriptType }}</UBadge>

      <h2 class="text-3xl">
        {{ account.label }}
      </h2>
    </div>
  </div>
</template>
