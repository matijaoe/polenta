const WALLETS = [
  {
    id: '5sDVnzEeXf15n4z-zndMz',
    label: 'Primary',
  },
  {
    id: 'fa3OvL4CqhSOtIPDqDG4r',
    label: 'New Nano S+',
  },
  {
    id: 'Ox7igk-tUfuWD7pmhQJjb',
    label: 'Old Ledger',
  },
  {
    id: 'nW4hS0V_4Hpgg47xNof9t',
    label: 'Uncle Jim',
  },
]

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = ref<any[]>(WALLETS)

  const getWallet = (walletId: string) => {
    return wallets.value.find((wallet) => wallet.id === walletId)
  }

  const getWallets = (walletId: string) => {
    return wallets.value.filter((wallet) => wallet.id === walletId)
  }

  return {
    wallets,
    getWallet,
    getWallets,
  }
})
