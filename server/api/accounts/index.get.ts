import { eq } from 'drizzle-orm'
import { accounts, wallets } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const res = await db
    .select()
    .from(accounts)
    .leftJoin(wallets, eq(wallets.id, accounts.walletId))
    .execute()

  return res?.map((row) => ({
    account: row.accounts,
    wallet: row.wallets,
  }))
})
