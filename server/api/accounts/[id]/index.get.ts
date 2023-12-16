import { eq } from 'drizzle-orm'
import { toNumber } from '@matijaoe/utils'
import { ErrorCode } from '~/models'
import { account_table } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const { id } = useParams<{ id: string }>()

  const parsedId = toNumber(id)

  if (!parsedId) {
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
