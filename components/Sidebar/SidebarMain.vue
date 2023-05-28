<script lang="ts" setup>
const accountsStore = useAccountsStore()
const walletsStore = useWalletsStore()

const accounts = computed(() => accountsStore.accounts.map(account => ({
  label: account.label,
  badge: account.scriptType,
  to: { name: 'wallets-walletId-accountId', params: { walletId: account.walletId, accountId: account.id } },
})))

const wallets = computed(() => walletsStore.wallets)

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
</script>

<template>
  <aside class="border-r border-gray-200 dark:border-gray-700 px-5 py-8 pb-14">
    <menu>
      <nav class="flex flex-col gap-2">
        <NuxtLink to="/">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/accounts">
          Accounts
        </NuxtLink>
      </nav>

      <div class="mt-8 space-y-8">
        <section>
          <div>
            <h2 class="font-bold">
              Accounts
            </h2>
            <p class="text-xs text-gray-400 dark:text-gray-600">
              Tied to wallets
            </p>
          </div>
          <UVerticalNavigation
            :links="accounts"
            class="-mx-3 mt-2"
          />
        </section>

        <section>
          <div>
            <h2 class="font-bold">
              Wallets
            </h2>
            <p class="text-xs text-gray-400 dark:text-gray-600">
              Unique xpub wallets
            </p>
          </div>

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
            class="-mx-3 mt-2"
          />
        </section>
      </div>
    </menu>
  </aside>
</template>
