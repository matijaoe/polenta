<script lang="ts" setup>
const { data: accountsArr } = await useAccounts()

const accountItems = computed(() => {
  return accountsArr.value?.map(({ account }) => ({
    label: account.name,
    click: () => {
      navigateTo({
        name: 'wallets-accountId',
        params: {
          accountId: account.id,
        }
      })
    }
  })) ?? []
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

        <UVerticalNavigation :links="accountItems" class="-mx-3 mt-2" />
      </section>
    </menu>
  </SidebarBase>
</template>
