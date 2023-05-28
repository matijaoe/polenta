import { defineStore } from 'pinia'

export const useWalletsStore = defineStore('wallets', () => {
  const wallets = [
    {
      label: 'Primary',
      walletId: '5sDVnzEeXf15n4z-zndMz',
    },
    {
      label: 'New Nano S+',
      walletId: 'fa3OvL4CqhSOtIPDqDG4r',
    },
    {
      label: 'Old Ledger',
      walletId: 'Ox7igk-tUfuWD7pmhQJjb',
    },
    {
      label: 'Uncle Jim',
      walletId: 'nW4hS0V_4Hpgg47xNof9t',
    },
  ]

  const getWallet = (walletId: string) => {
    return wallets.find(wallet => wallet.walletId === walletId)
  }

  const getWallets = (walletId: string) => {
    return wallets.filter(wallet => wallet.walletId === walletId)
  }

  return {
    wallets,
    getWallet,
    getWallets,
  }
})
