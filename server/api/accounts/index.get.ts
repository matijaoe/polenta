import { eq } from 'drizzle-orm'
import { accounts, wallets } from '~/server/db/schema'

export default defineEventHandler(() => {
  return db.query.accounts.findMany({
    with: {
      wallet: true,
    }
  })
})
