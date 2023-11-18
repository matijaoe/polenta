import { sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type DatabaseSchema = {
  wallets: typeof wallets
  accounts: typeof accounts
}

// ----------------------------------------------------------------------------
// wallets
// ----------------------------------------------------------------------------

export const wallets = sqliteTable('wallets', {
  id: integer('id', { mode: 'number' }).primaryKey(),
  xpub: text('xpub').notNull().unique(),
  derivationPath: text('derivation_path').notNull(),
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
// accounts
// ----------------------------------------------------------------------------

export const accounts = sqliteTable('accounts', {
  walletId: integer('wallet_id').notNull().references(() => wallets.id),
  index: integer('index').notNull().default(0),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.walletId, table.index] }),
  }
})

export type Account = typeof accounts.$inferSelect
export type AccountInsert = typeof accounts.$inferInsert
export type AccountField = keyof Account
