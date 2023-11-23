import { eq } from 'drizzle-orm'
import { ErrorCode } from '~/models'
import { accounts, wallets } from '~/server/db/schema'

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

  const res = db.select()
    .from(accounts)
    .where(eq(accounts.id, parsedId))
    .leftJoin(wallets, eq(wallets.id, accounts.walletId))
    .get()

  if (!res) {
    throw createError({
      statusCode: 404,
      message: 'Account not found',
      data: {
        errorCode: ErrorCode.NOT_FOUND
      }
    })
  }
  return {
    account: res.accounts,
    wallet: res.wallets
  }
})
