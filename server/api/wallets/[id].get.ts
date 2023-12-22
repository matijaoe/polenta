import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ErrorCode } from '~/models'
import { wallet_table } from '~/server/db/schema'
import { parseBooleanQuery } from '~/utils'

const paramsSchema = z.object({
  id: z.coerce.number(z.string())
})

const accountsSchema = z.object({
  accounts: z.string().transform(parseBooleanQuery).optional(),
  num: z.number().optional()
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, paramsSchema.safeParse)

  if (!params.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID',
      message: extractZodErrorMessage(params.error),
      data: {
        errorCode: ErrorCode.VALIDATION_ERROR
      }
    })
  }

  const { id } = params.data

  const { accounts: includeAccounts } = await getValidatedQuery(event, accountsSchema.parse)

  const wallet = await db.query.wallet_table.findFirst({
    where: eq(wallet_table.id, id),
    with: includeAccounts ? { accounts: true } : {}
  })

  if (!wallet) {
    throw createError({
      statusCode: 404,
      message: 'Wallet not found',
      data: {
        errorCode: ErrorCode.NOT_FOUND
      }
    })
  }

  return wallet
})
