import type { Config } from 'drizzle-kit'

export default {
  out: './server/db/migrations',
  schema: './server/db/schema.ts',
  driver: 'better-sqlite',
  dbCredentials: {
    url: './polenta.db',
  }
} satisfies Config
