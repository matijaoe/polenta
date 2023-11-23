<script lang="ts" setup>
const route = useRoute('wallets-walletId')
const walletId = computed(() => route.params.walletId)

definePageMeta({
  layout: 'dual-sidebar',
})
</script>

<template>
  <div>
    <div class="text-3xl">
      wallet page
    </div>

    <h1 class="text-5xl">
      {{ walletId }}
    </h1>

    <UCard>
      <NuxtPage :foobar="123" />
    </UCard>
  </div>
</template>
