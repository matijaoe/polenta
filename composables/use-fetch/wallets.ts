import type { Account, Wallet } from '~/server/db/schema'

export const useWallets = async () => {
  const app = useNuxtApp()

  const res = await useFetch<(Wallet & { accounts: Account[] })[]>('/api/wallets', {
    key: 'wallets',
    query: {
      accounts: true
    },
    getCachedData(key) {
      return app.payload.data[key] || app.static.data[key]
    },
  })

  return res
}

export const useWallet = async (walletId: MaybeRef<number>, options = {}) => {
  const app = useNuxtApp()

  const res = await useFetch<Wallet & { accounts: Account[] }>(`/api/wallets/${unref(walletId)}`, {
    query: {
      accounts: true
    },
    getCachedData(key) {
      return app.payload.data[key] || app.static.data[key]
    },
    ...options,
  })

  return res
}
