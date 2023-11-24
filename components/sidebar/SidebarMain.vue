<script lang="ts" setup>
import type { VerticalNavigationLink } from '@nuxt/ui/dist/runtime/types'

const devicesStore = useDeviceStore()
const { data: accounts } = await useAccounts()
const { data: wallets } = await useWallets()

const accountItems = computed<VerticalNavigationLink[]>(() => {
  return accounts.value?.map((account) => ({
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

const walletItems = computed<VerticalNavigationLink[]>(() => {
  return wallets.value?.map((wallet) => ({
    label: `${wallet.name}`,
    click: () => {
      // TODO: handle this at middleware level
      const [firstAccount] = wallet.accounts ?? []
      if (!firstAccount) {
        console.error('No accounts found for wallet', wallet)
        return
      }
      navigateTo({
        name: 'wallets-walletId-accountId',
        params: {
          walletId: wallet.id,
          accountId: firstAccount.id,
        }
      })
    }

  })) ?? []
})

const devices = computed<VerticalNavigationLink[]>(() => devicesStore.devices.map((device) => {
  return {
    label: device.label,
    click: () => navigateTo({
      name: 'devices-deviceId',
      params: { deviceId: device.id },
    }),
  }
}))

const links: VerticalNavigationLink[] = [
  {
    label: 'Dashboard',
    click: () => navigateTo('/'),
  },
  {
    label: 'Settings',
    click: () => navigateTo('/settings'),
  },
]
</script>

<template>
  <SidebarBase>
    <menu>
      <nav class="flex flex-col gap-2">
        <UVerticalNavigation
          :links="links"
          class="-mx-3"
        />
      </nav>

      <div class="mt-8 space-y-6">
        <SidebarMainSection
          :links="accountItems"
          title="Accounts"
          to="/wallets"
        />

        <SidebarMainSection
          :links="walletItems"
          title="Wallets"
          to="/wallets"
        >
          <template #right>
            <UTooltip text="Add device" :popper="{ placement: 'right' }">
              <UButton
                size="xs"
                icon="i-heroicons-plus"
                square
                color="white"
                @click="navigateTo('/wallets/new')"
              />
            </UTooltip>
          </template>
        </SidebarMainSection>

        <SidebarMainSection
          :links="devices"
          title="Devices"
          to="/devices"
        >
          <template #right>
            <UTooltip text="Add device" :popper="{ placement: 'right' }">
              <UButton
                size="xs"
                icon="i-heroicons-plus"
                square
                color="white"
                @click="navigateTo('/devices/new')"
              />
            </UTooltip>
          </template>
        </SidebarMainSection>
      </div>
    </menu>
  </SidebarBase>
</template>
