import { z } from 'zod'
import { parseBooleanQuery } from '~/utils'

const querySchema = z.object({
  accounts: z.string().optional().transform((v) => parseBooleanQuery(v))
})

export default defineEventHandler(async (event) => {
  // TODO: decide on using zod vs valibot
  // const parseQuery = (v: unknown) => {
  //   const schema = object({
  //     accounts: transform(optional(string()), parseBooleanQuery)
  //   })
  //   return parse(schema, v)
  // }

  // const { accounts: includeAccounts } = await getValidatedQuery(event, parseQuery)

  const { accounts: includeAccounts } = await getValidatedQuery(event, querySchema.parse)

  return db.query.wallet_table.findMany({
    with: includeAccounts ? { accounts: true } : {}
  })
})
