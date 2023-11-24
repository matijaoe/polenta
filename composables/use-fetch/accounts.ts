import { FetchKey } from './keys'

export const useAccounts = async () => {
  const app = useNuxtApp()

  const res = await useFetch<AccountWithWallet[]>('/api/accounts', {
    key: FetchKey.Accounts,
    getCachedData(key) {
      return app.payload.data[key] || app.static.data[key]
    },
  })

  return res
}

export const useAccount = async (accountId: MaybeRef<number>) => {
  const app = useNuxtApp()

  const res = await useFetch<AccountWithWallet>(`/api/accounts/${unref(accountId)}`, {
    getCachedData(key) {
      return app.payload.data[key] || app.static.data[key]
    },
  })

  return res
}
