<script lang="ts" setup>
const walletsStore = useWalletsStore()

const wallets = computed(() => walletsStore.wallets.map((wallet) => {
  return {
    label: wallet.label,
    to: {
      name: 'wallets-walletId',
      params: { walletId: wallet.id },
    },
  }
}))

const devices = [
  {
    label: 'COLDCARD',
  },
  {
    label: 'COLDCARD backup',
  },
  {
    label: 'Ledger Nano S Plus',
  },
  {
    label: 'Ledger Nano S',
  },
  {
    label: 'Trezor One',
  },
]

const links = [
  {
    label: 'Dashboard',
    to: {
      name: 'index',
    },
  },
  {
    label: 'Accounts',
    to: {
      name: 'accounts',
    },
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

      <div class="mt-8 space-y-10">
        <section>
          <h2 class="font-bold">
            Wallets
          </h2>

          <UVerticalNavigation
            :links="wallets"
            class="-mx-3 mt-2"
          />
        </section>

        <section>
          <h2 class="font-bold">
            Devices
          </h2>

          <UVerticalNavigation
            :links="devices"
            class="-mx-3 mt-1"
          />
        </section>
      </div>
    </menu>
  </SidebarBase>
</template>
