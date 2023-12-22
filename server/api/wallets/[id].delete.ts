import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ErrorCode } from '~/models'
import { wallet_table } from '~/server/db/schema'

const paramsSchema = z.object({
  id: z.coerce.number(z.string())
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

  const res = await db
    .delete(wallet_table)
    .where(eq(wallet_table.id, id))
    .execute()

  if (res.changes === 0) {
    throw createError({
      statusCode: 404,
      message: 'Wallet not found',
      data: {
        errorCode: ErrorCode.NOT_FOUND
      }
    })
  }

  return res
})
