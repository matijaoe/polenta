import { sql } from 'drizzle-orm'
import { integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export type DatabaseSchema = {
  wallets: typeof wallets_table
  accounts: typeof accounts_table
}

// ----------------------------------------------------------------------------
// wallets
// ----------------------------------------------------------------------------

export const wallets_table = sqliteTable('wallets', {
  id: text('id').primaryKey(),
  xpub: text('xpub').notNull().unique(),
  derivationPath: text('derivation_path').notNull(),
  name: text('name').notNull(),
  description: text('description'),
  scriptType: text('script_type').notNull(),
  passphraseProtected: integer('passphrase_protected', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
})

export type WalletSelect = typeof wallets_table.$inferSelect
export type WalletInsert = typeof wallets_table.$inferInsert
export type WalletField = keyof WalletSelect

// ----------------------------------------------------------------------------
// accounts
// ----------------------------------------------------------------------------

export const accounts_table = sqliteTable('accounts', {
  walletId: text('wallet_id').notNull().references(() => wallets_table.id),
  index: integer('index').notNull().default(0),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.walletId, table.index] }),
  }
})

export type AccountSelect = typeof accounts_table.$inferSelect
export type AccountInsert = typeof accounts_table.$inferInsert
export type AccountField = keyof AccountSelect
