<script lang="ts" setup>
const devicesStore = useDeviceStore()
const { data: accounts } = await useAccounts()
const { data: wallets } = await useWallets()

const accountItems = computed(() => {
  return accounts.value?.map(({ account }) => ({
    label: `${account.name}`,
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

const walletItems = computed(() => {
  return wallets.value?.map((wallet) => ({
    label: `${wallet.name}`,
    click: () => {
      navigateTo({
        name: 'wallets-walletId',
        params: {
          walletId: wallet.id,
        }
      })
    }

  })) ?? []
})

const devices = computed(() => devicesStore.devices.map((device) => {
  return {
    label: device.label,
    click: () => navigateTo({
      name: 'devices-deviceId',
      params: { deviceId: device.id },
    }),
  }
}))

const links = [
  {
    label: 'Dashboard',
    click: () => navigateTo({
      name: 'index',
    }),
  },
  {
    label: 'Settings',
    click: () => navigateTo({
      name: 'settings',
    }),
  },
]

const onAddWallet = () => {
  navigateTo({ name: 'wallets-new' })
}

const onAddDevice = () => {
  navigateTo({ name: 'devices-new' })
}
</script>

<template>
  <SidebarBase>
    <menu>
      <nav class="flex flex-col gap-2">
        <UVerticalNavigation :links="links" class="-mx-3" />
      </nav>

      <div class="mt-8 space-y-6">
        <section>
          <div class="flex items-center justify-between">
            <UButton
              :ui="{ font: 'font-bold' }"
              :padded="false"
              size="lg"
              variant="link"
              color="black"
              :to="{ name: 'wallets' }"
              class="font-bold"
            >
              Accounts
            </UButton>
          </div>

          <UVerticalNavigation :links="accountItems" class="-mx-3 mt-2" />
        </section>

        <section>
          <div class="flex items-center justify-between">
            <UButton
              :ui="{ font: 'font-bold' }"
              :padded="false"
              size="lg"
              variant="link"
              color="black"
              :to="{ name: 'wallets' }"
              class="font-bold"
            >
              Wallets
            </UButton>

            <UTooltip text="Add wallet" :popper="{ placement: 'right' }">
              <UButton size="xs" icon="i-heroicons-plus" square color="white" @click="onAddWallet" />
            </UTooltip>
          </div>

          <UVerticalNavigation :links="walletItems" class="-mx-3 mt-2" />
        </section>

        <section>
          <div class="flex items-center justify-between">
            <UButton
              :ui="{ font: 'font-bold' }"
              :padded="false"
              size="lg"
              variant="link"
              color="black"
              :to="{ name: 'devices' }"
              class="font-bold"
            >
              Devices
            </UButton>

            <UTooltip text="Add device" :popper="{ placement: 'right' }">
              <UButton size="xs" icon="i-heroicons-plus" square color="white" @click="onAddDevice" />
            </UTooltip>
          </div>

          <UVerticalNavigation :links="devices" class="-mx-3 mt-1" />
        </section>
      </div>
    </menu>
  </SidebarBase>
</template>
