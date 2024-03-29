import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import * as schema from '~/server/db/schema'

const sqlite = new Database('polenta.db', {
  fileMustExist: true,
})

export const db = drizzle(sqlite, {
  schema
})
