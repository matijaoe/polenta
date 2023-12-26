<script lang="ts" setup>
const { account } = defineProps<{
  account: AccountWithWallet
}>()

const wallet = computed(() => account.wallet)

const isBlankFp = (fp: string) => {
  return fp.split('').every((c) => c === '0')
}
</script>

<template>
  <UCard
    class="group aspect-square h-[300px]"
    :ui="{
      shadow: 'shadow-inner',
      background: 'bg-white dark:bg-gray-800/20',
      header: {
        padding: 0
      }
    }"
  >
    <template #header>
      <NuxtLink
        :to="{
          name: 'wallets-walletId-accountId',
          params: {
            walletId: account.walletId,
            accountId: account.id,
          }
        }"
      >
        <div class="px-2 py-5 sm:px-5 flex flex-col gap-2 items-start w-full transition duration-75 hover:bg-gray-100/40 hover:dark:bg-gray-800/20">
          <div class="flex items-center justify-between w-full">
            <UTooltip :text="account.name" :popper="{ placement: 'top-start' }">
              <h3 variant="link" class="leading-none line-clamp-1" :data-value="account.name">
                {{ account.name }}
              </h3>
            </UTooltip>

            <div class="-mx-0.5 flex items-center gap-2">
              <UTooltip text="Master fingerprint" :popper="{ placement: 'top' }">
                <UBadge
                  variant="subtle"
                  :color="isBlankFp(account.fingerprint) ? 'white' : 'primary'"
                  :ui="isBlankFp(account.fingerprint) && {
                    variant: {
                      subtle: 'ring-inset ring-gray-500 dark:ring-gray-400 text-gray-400'
                    }
                  }"
                >
                  {{ account.fingerprint }}
                </UBadge>
              </UTooltip>
            </div>
          </div>

          <div>
            <ULink
              class="group bg-orange-500"
              :to="{
                name: 'wallets-walletId',
                params: {
                  walletId: account.walletId,
                }
              }"
            >
              <div class="flex items-center gap-2">
                <p class="text-xs text-gray-600 dark:text-gray-500 hover:underline underline-offset-2 line-clamp-1">
                  {{ wallet.name }}
                </p>
              </div>
            </ULink>
          </div>
        </div>
      </NuxtLink>
    </template>

    <div>
      <div>
        <!-- not mine, i lost mine in a boating accident -->
        <div class="flex items-center">
          <p class="text-2xl font-bold">
            0.29362027
          </p>
          <p class="text-2xl text-gray-400 ml-2">
            BTC
          </p>
        </div>

        <div class="mt-2 space-y-1 pt-2">
          <div class="flex items-center">
            <i class="i-ph-currency-eur text-md text-white" />
            <p class="text-sm text-gray-400">
              10,354.31
            </p>
          </div>
          <div class="flex items-center">
            <i class="i-ph-currency-dollar text-md text-white" />
            <p class="text-sm text-gray-400">
              11,272.45
            </p>
          </div>
        </div>
      </div>
    </div>
  </UCard>
</template>
