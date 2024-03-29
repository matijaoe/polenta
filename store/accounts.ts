import { Script } from '~/models'

const ACCOUNTS = [
  {
    id: 'PrPW7WC1RW14LstMwvIom',
    label: 'BTC #1',
    scriptType: Script.native_segwit,
    walletId: '5sDVnzEeXf15n4z-zndMz',
  },
  {
    id: 'LMrf99Heh7FjznRnN4xZs',
    label: 'BTC #2',
    scriptType: Script.native_segwit,
    walletId: '5sDVnzEeXf15n4z-zndMz',
  },
  {
    id: 'zqDQ7Kz92AjDVoP-Nxp',
    label: 'BTC #3',
    scriptType: Script.taproot,
    walletId: '5sDVnzEeXf15n4z-zndMz',
  },
  {
    id: 'luLFOiVBhQ4RpamGGO8k2',
    label: 'BTC #old',
    scriptType: Script.legacy,
    walletId: '5sDVnzEeXf15n4z-zndMz',
  },
  {
    id: 'zO5wr0gxd5RqyxKC51JPQ',
    label: 'mom',
    scriptType: Script.native_segwit,
    walletId: 'nW4hS0V_4Hpgg47xNof9',
  },
  {
    id: 'Jb-Jv4hVHP7N0trveeN',
    label: 'CC duress',
    scriptType: Script.native_segwit,
    walletId: '5sDVnzEeXf15n4z-zndMz',
  },
  {
    id: 'Dj45a37JBFxzhHOoe67iB',
    label: 'BTC nano s',
    scriptType: Script.segwit,
    walletId: 'fa3OvL4CqhSOtIPDqDG4r',
  },
  {
    id: 'IMRNoQD8IbPy8jMT7NPKv',
    label: 'old nano s',
    scriptType: Script.legacy,
    walletId: 'Ox7igk-tUfuWD7pmhQJjb',
  },
]

export const useAccountsStore = defineStore('accounts', () => {
  const accounts = ref<any[]>(ACCOUNTS)

  const getAccount = (accountId: string) => {
    return accounts.value.find((account) => account.id === accountId)
  }

  const getWalletAccounts = (walletId: string) => {
    return accounts.value.filter((account) => account.walletId === walletId)
  }

  return {
    accounts,
    getAccount,
    getWalletAccounts,
  }
})
