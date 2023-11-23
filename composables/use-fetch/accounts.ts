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
