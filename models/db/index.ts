import type { account_table, addressStats_table, address_table, wallet_table } from '~/server/db/schema'

export type Wallet = typeof wallet_table.$inferSelect
export type WalletInsert = typeof wallet_table.$inferInsert
export type WalletField = keyof Wallet

export type Account = typeof account_table.$inferSelect
export type AccountInsert = typeof account_table.$inferInsert
export type AccountField = keyof Account

export type Address = typeof address_table.$inferSelect
export type AddressInsert = typeof address_table.$inferInsert
export type AddressField = keyof Address

export type AddressStats = typeof addressStats_table.$inferSelect
export type AddressStatsInsert = typeof addressStats_table.$inferInsert
export type AddressStatsField = keyof AddressStats

// ----------------------------------------------------------------------------

export type WalletWithAccounts = Wallet & {
  accounts: Account[]
}

export type AccountWithWallet = Account & {
  wallet: Wallet
}

export type AccountWithAddresses = Account & {
  addresses: Address[]
}

export type AddressWithAccount = Address & {
  account: Account
}

export type AddressWithStats = Address & {
  stats: AddressStats
}
