import { wallets } from '~/server/db/schema'
import { db } from '~/server/utils/db'

export default defineEventHandler(async () => {
  return db.select().from(wallets)
})
