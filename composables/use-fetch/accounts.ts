export const useAccounts = async () => {
  const res = await useFetch<AccountWithWallet[]>('/api/accounts', {
    key: FetchKey.Accounts,
    getCachedData,
  })

  return res
}

export const useAccount = async (accountId: MaybeRef<number>) => {
  const res = await useFetch<AccountWithWallet>(`/api/accounts/${unref(accountId)}`, {
    key: FetchKey.Account(accountId),
    getCachedData,
  })

  return res
}
