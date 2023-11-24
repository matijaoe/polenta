import { eq } from 'drizzle-orm'
import { ErrorCode } from '~/models'
import { account_table, wallet_table } from '~/server/db/schema'

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

  if (includeAccounts) {
    const res = await db.select()
      .from(wallet_table)
      .where(eq(wallet_table.id, parsedId))
      .leftJoin(account_table, eq(wallet_table.id, account_table.walletId))
      .execute()

    if (!res?.at(0)) {
      throw createError({
        statusCode: 404,
        message: 'Wallet not found',
        data: {
          errorCode: ErrorCode.NOT_FOUND
        }
      })
    }

    const wallet = res.at(0)!.wallets
    return {
      ...wallet,
      accounts: res.map((item) => item.accounts) ?? [],
    }
  } else {
    const wallet = db.select()
      .from(wallet_table)
      .where(eq(wallet_table.id, parsedId))
      .get()

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
  }
})
