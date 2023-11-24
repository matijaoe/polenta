import type { ErrorCode } from '~/models'

export const useWallets = async () => {
  const app = useNuxtApp()

  const res = await useFetch<WalletWithAccounts[]>('/api/wallets', {
    key: FetchKey.Wallets,
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

  const res = await useFetch<WalletWithAccounts>(`/api/wallets/${unref(walletId)}`, {
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

export const useCreateWallet = async (body: ComputedRef<RequestInit['body'] | Record<string, any>>) => {
  const res = await useFetch('/api/wallets', {
    method: 'POST',
    immediate: false,
    watch: false,
    body,
  })

  const errorCode = computed(() => res.error.value?.data.data?.errorCode as ErrorCode | undefined)
  const isSuccess = computed(() => res.status.value === 'success')
  const isLoading = computed(() => res.status.value === 'pending')

  return {
    ...res,
    errorCode,
    isSuccess,
    isLoading,
  }
}
