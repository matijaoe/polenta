import { defineStore } from 'pinia'
import type { Account } from 'models'

export const useAccountsStore = defineStore('accounts', () => {
  const accounts: Account[] = [
    {
      label: 'BTC #1',
      scriptType: 'native segwit',
      id: 'PrPW7WC1RW14LstMwvIom',
    },
    {
      label: 'BTC #2',
      scriptType: 'native segwit',
      id: 'LMrf99Heh7FjznRnN4xZs',
    },
    {
      label: 'BTC #3',
      scriptType: 'taproot',
      id: 'zqDQ7Kz92AjDVoP-Nxp',
    },
    {
      label: 'mom',
      scriptType: 'native segwit',
      id: 'zO5wr0gxd5RqyxKC51JPQ',
    },
    {
      label: 'CC duress',
      scriptType: 'native segwit',
      id: 'Jb-Jv4hVHP7N0trveeN',
    },
    {
      label: 'BTC nano s',
      scriptType: 'segwit',
      id: 'Dj45a37JBFxzhHOoe67iB',
    },
    {
      label: 'samourai starter',
      scriptType: 'legacy',
      id: 'IMRNoQD8IbPy8jMT7NPKv',
    },
  ]

  const getAccount = (id: string) => {
    return accounts.find(account => account.id === id)
  }

  return {
    accounts,
  }
})
