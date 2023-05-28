import { defineStore } from 'pinia'
import type { Account } from 'models'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts: Account[] = [
    {
      label: 'BTC #1',
      scriptType: 'native segwit',
      id: 'PrPW7WC1RW14LstMwvIom',
      walletId: '5sDVnzEeXf15n4z-zndMz',
    },
    {
      label: 'BTC #2',
      scriptType: 'native segwit',
      id: 'LMrf99Heh7FjznRnN4xZs',
      walletId: '5sDVnzEeXf15n4z-zndMz',
    },
    {
      label: 'BTC #3',
      scriptType: 'taproot',
      id: 'zqDQ7Kz92AjDVoP-Nxp',
      walletId: '5sDVnzEeXf15n4z-zndMz',
    },
    {
      label: 'mom',
      scriptType: 'native segwit',
      id: 'zO5wr0gxd5RqyxKC51JPQ',
      walletId: 'nW4hS0V_4Hpgg47xNof9',
    },
    {
      label: 'CC duress',
      scriptType: 'native segwit',
      id: 'Jb-Jv4hVHP7N0trveeN',
      walletId: '5sDVnzEeXf15n4z-zndMz',
    },
    {
      label: 'BTC nano s',
      scriptType: 'segwit',
      id: 'Dj45a37JBFxzhHOoe67iB',
      walletId: 'fa3OvL4CqhSOtIPDqDG4r',
    },
    {
      label: 'old nano s',
      scriptType: 'legacy',
      id: 'IMRNoQD8IbPy8jMT7NPKv',
      walletId: 'Ox7igk-tUfuWD7pmhQJjb',
    },
  ]

  const getAccount = (id: string) => {
    return accounts.find(account => account.id === id)
  }

  const getWalletAccounts = (walletId: string) => {
    return accounts.filter(account => account.walletId === walletId)
  }

  return {
    accounts,
    getAccount,
    getAccountWallets: getWalletAccounts,
  }
})
