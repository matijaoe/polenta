import { eq } from 'drizzle-orm'
import { ErrorCode } from '~/models'
import { wallet_table } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const { id } = useParams<{ id: string }>()
  const { accounts: includeAccounts } = useQueryParams<{ accounts: boolean }>({
    parseBooleans: true
  })

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

  const wallet = await db.query.wallet_table.findFirst({
    where: eq(wallet_table.id, parsedId),
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
