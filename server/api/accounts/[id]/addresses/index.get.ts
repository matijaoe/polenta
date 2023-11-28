import { eq } from 'drizzle-orm'
import { ErrorCode } from '~/models'
import { account_table } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const { id } = useParams<{ id: string }>()

  const accountId = Number.parseInt(id, 10)

  if (Number.isNaN(accountId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation error',
      message: 'Invalid ID',
      data: {
        errorCode: ErrorCode.VALIDATION_ERROR
      }
    })
  }

  const account = await db.query.account_table.findFirst({
    where: eq(account_table.id, accountId),
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
