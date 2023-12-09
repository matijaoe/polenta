export const FetchKey = {
  Wallets: 'wallets',
  Wallet: (id: MaybeRef<string | number>) => `wallet:${unref(id)}`,
  Accounts: 'accounts',
  Account: (id: MaybeRef<string | number>) => `account:${unref(id)}`,
  AccountAddresses: (id: MaybeRef<string | number>) => `account:${unref(id)}:addresses`,
  BitcoinExchangeRate: 'bitcoin-exchange-rate',
} as const

export type FetchKeyModel = keyof typeof FetchKey
