import { eq } from 'drizzle-orm'
import { ErrorCode } from '~/models'

export default defineEventHandler(async () => {
  const { id } = useParams<{ id: string }>()

  const parsedId = Number.parseInt(id, 10)

  if (Number.isNaN(parsedId)) {
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
   	where: eq(account_table.id, parsedId),
    with: {
      wallet: true
    }
  })

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
