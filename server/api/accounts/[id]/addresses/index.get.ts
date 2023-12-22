import { eq } from 'drizzle-orm'
import { z } from 'zod'
import { ErrorCode } from '~/models'
import { account_table } from '~/server/db/schema'

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

  const account = await db.query.account_table.findFirst({
    where: eq(account_table.id, id),
    columns: {
      id: true,
      walletId: true
    },
    with: {
      addresses: {
        columns: {
          index: true,
          type: true,
          address: true
        }
      }
    }
  }).execute()

  if (!account) {
    throw createError({
      statusCode: 404,
      message: 'Account not found',
      data: {
        errorCode: ErrorCode.NOT_FOUND
      }
    })
  }

  return account
})
