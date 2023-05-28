import { defineStore } from 'pinia'
import type { Wallet } from '~/models'

export const useWalletsStore = defineStore('wallets', () => {
  const wallets: Wallet[] = [
    {
      label: 'Primary',
      id: '5sDVnzEeXf15n4z-zndMz',
    },
    {
      label: 'New Nano S+',
      id: 'fa3OvL4CqhSOtIPDqDG4r',
    },
    {
      label: 'Old Ledger',
      id: 'Ox7igk-tUfuWD7pmhQJjb',
    },
    {
      label: 'Uncle Jim',
      id: 'nW4hS0V_4Hpgg47xNof9t',
    },
  ]

  const getWallet = (walletId: string) => {
    return wallets.find(wallet => wallet.id === walletId)
  }

  const getWallets = (walletId: string) => {
    return wallets.filter(wallet => wallet.id === walletId)
  }

  return {
    wallets,
    getWallet,
    getWallets,
  }
})
