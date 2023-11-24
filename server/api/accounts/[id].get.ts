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

  const res = db.query.accounts.findFirst({
   	where: (accounts, { eq }) => (eq(accounts.id, parsedId)),
    with: {
      wallet: true
    }
  })

  if (!res) {
    throw createError({
      statusCode: 404,
      message: 'Account not found',
      data: {
        errorCode: ErrorCode.NOT_FOUND
      }
    })
  }

  return res
})
