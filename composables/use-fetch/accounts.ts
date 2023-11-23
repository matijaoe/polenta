import type { Account, Wallet } from '~/server/db/schema'

export const useAccounts = async () => {
  const app = useNuxtApp()

  const res = await useFetch<{
    account: Account
    wallet: Wallet
  }[]>('/api/accounts', {
    key: 'accounts',
    getCachedData(key) {
      return app.payload.data[key] || app.static.data[key]
    },
  })

  return res
}

export const useAccount = async (accountId: MaybeRef<number>) => {
  const app = useNuxtApp()

  const res = await useFetch<{
    account: Account
    wallet: Wallet
  }>(`/api/accounts/${unref(accountId)}`, {
    getCachedData(key) {
      return app.payload.data[key] || app.static.data[key]
    },
  })

  const account = computed(() => res.data.value?.account)
  const wallet = computed(() => res.data.value?.wallet)

  return {
    ...res,
    account,
    wallet,
  }
}
