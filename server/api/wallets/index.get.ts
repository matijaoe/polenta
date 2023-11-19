import { wallets } from '~/server/db/schema'

export default defineEventHandler(async () => {
  return db.select().from(wallets)
})
