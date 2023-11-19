import { accounts } from '~/server/db/schema'

export default defineEventHandler(async () => {
  return db.select().from(accounts)
})
