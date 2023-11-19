import { eq } from 'drizzle-orm'
import { ErrorCode } from '~/models/errors'
import { wallets } from '~/server/db/schema'

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

  const res = await db.delete(wallets).where(eq(wallets.id, parsedId)).execute()

  if (res.changes === 0) {
    throw createError({
      statusCode: 404,
      message: 'Wallet not found',
      name: 'WalletNotFoundError',
      data: {
        errorCode: ErrorCode.NOT_FOUND
      }
    })
  }

  return res
})
