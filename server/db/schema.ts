import { table } from '@nuxt/ui'
import { sql } from 'drizzle-orm'
import { integer, primaryKey, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export type DatabaseSchema = {
  wallets: typeof wallets
  accounts: typeof accounts
  addresses: typeof addresses
  addressStats: typeof addressStats
}

// ----------------------------------------------------------------------------
// wallet
// ----------------------------------------------------------------------------

export const wallets = sqliteTable('wallets', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  scriptType: text('script_type').notNull(),
  passphraseProtected: integer('passphrase_protected', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type Wallet = typeof wallets.$inferSelect
export type WalletInsert = typeof wallets.$inferInsert
export type WalletField = keyof Wallet

// ----------------------------------------------------------------------------
// account
// ----------------------------------------------------------------------------

export const accounts = sqliteTable('accounts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  walletId: integer('wallet_id').references(() => wallets.id, {
    onDelete: 'cascade',
  }).notNull(),
  xpub: text('xpub').notNull().unique(),
  fingerprint: text('fingerprint').notNull().default('00000000'),
  derivationPath: text('derivation_path').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, t => ({
  unq: unique().on(t.walletId, t.derivationPath),
}))

export type Account = typeof accounts.$inferSelect
export type AccountInsert = typeof accounts.$inferInsert
export type AccountField = keyof Account

// ----------------------------------------------------------------------------
// address
// ----------------------------------------------------------------------------

export const addresses = sqliteTable('address', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  accountId: integer('account_id').references(() => accounts.id, {
    onDelete: 'cascade',
  }).notNull(),
  type: integer('address_type').notNull(), // 0 for receiving, 1 for change
  index: integer('address_index').notNull(), // The index in the derivation path
  address: text('address').notNull().unique(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type Address = typeof addresses.$inferSelect
export type AddressInsert = typeof addresses.$inferInsert
export type AddressField = keyof Address

// ----------------------------------------------------------------------------
// address stats
// ----------------------------------------------------------------------------

export const addressStats = sqliteTable('address_stats', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  addressId: integer('address_id').references(() => addresses.id, {
    onDelete: 'cascade',
  }).notNull(),
  spentTxoCount: integer('spent_txo_count').notNull(),
  spentTxoSum: real('spent_txo_sum').notNull(),
  fundedTxoCount: integer('funded_txo_count').notNull(),
  fundedTxoSum: real('funded_txo_sum').notNull(),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type AddressStats = typeof addressStats.$inferSelect
export type AddressStatsInsert = typeof addressStats.$inferInsert
export type AddressStatsField = keyof AddressStats
