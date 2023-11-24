/* eslint-disable ts/no-use-before-define */
import { relations, sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text, unique } from 'drizzle-orm/sqlite-core'

export type DatabaseSchema = {
  wallets: typeof wallet_table
  accounts: typeof account_table
  addresses: typeof address_table
  addressStats: typeof addressStats_table
}

// ----------------------------------------------------------------------------
// wallet
// ----------------------------------------------------------------------------

export const wallet_table = sqliteTable('wallets', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  scriptType: text('script_type').notNull(),
  passphraseProtected: integer('passphrase_protected', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const walletRelation = relations(wallet_table, ({ many }) => ({
  accounts: many(account_table),
}))

// ----------------------------------------------------------------------------
// account
// ----------------------------------------------------------------------------

export const account_table = sqliteTable('accounts', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  walletId: integer('wallet_id').references(() => wallet_table.id, {
    onDelete: 'cascade',
  }).notNull(),
  xpub: text('xpub').notNull().unique(),
  fingerprint: text('fingerprint').notNull().default('00000000'),
  derivationPath: text('derivation_path').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (t) => ({
  unq: unique().on(t.walletId, t.derivationPath),
}))

export const accountsRelation = relations(account_table, ({ one, many }) => ({
  wallet: one(wallet_table, { fields: [account_table.walletId], references: [wallet_table.id], relationName: 'wallet' }),
  addresses: many(address_table),
}))

// ----------------------------------------------------------------------------
// address
// ----------------------------------------------------------------------------

export const address_table = sqliteTable('address', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  accountId: integer('account_id').references(() => account_table.id, {
    onDelete: 'cascade',
  }).notNull(),
  type: integer('address_type').notNull(), // 0 for receiving, 1 for change
  index: integer('address_index').notNull(), // The index in the derivation path
  address: text('address').notNull().unique(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const addressesRelation = relations(address_table, ({ one }) => ({
  account: one(account_table, { fields: [address_table.accountId], references: [account_table.id] }),
  stats: one(addressStats_table, { fields: [address_table.id], references: [addressStats_table.addressId] })
}))

// ----------------------------------------------------------------------------
// address stats
// ----------------------------------------------------------------------------

export const addressStats_table = sqliteTable('address_stats', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  addressId: integer('address_id').references(() => address_table.id, {
    onDelete: 'cascade',
  }).notNull(),
  spentTxoCount: integer('spent_txo_count').notNull(),
  spentTxoSum: real('spent_txo_sum').notNull(),
  fundedTxoCount: integer('funded_txo_count').notNull(),
  fundedTxoSum: real('funded_txo_sum').notNull(),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export const addressStatsRelation = relations(addressStats_table, ({ one }) => ({
  address: one(address_table, { fields: [addressStats_table.addressId], references: [address_table.id] }),
}))
