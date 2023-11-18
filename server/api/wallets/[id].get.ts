import { eq } from 'drizzle-orm'
import { accounts, wallets } from '~/server/db/schema'

export default defineEventHandler(async () => {
  const { id } = useParams<{ id: string }>()
  const { accounts: includeAccounts } = useQueryParams<{ accounts: boolean }>()

  const parsedId = Number.parseInt(id, 10)

  if (Number.isNaN(parsedId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation error',
      message: 'Invalid id',
    })
  }

  if (includeAccounts) {
    const res = await db.select()
      .from(wallets)
      .where(eq(wallets.id, parsedId))
      .leftJoin(accounts, eq(wallets.id, accounts.walletId))
      .execute()

    if (!res?.at(0)) {
      throw createError({
        statusCode: 404,
        message: 'Wallet not found',
        name: 'WalletNotFoundError',
      })
    }
    return {
      ...res.at(0)!.wallets,
      accounts: res.map(item => item.accounts) ?? [],
    }
  } else {
    const wallet = db.select()
      .from(wallets)
      .where(eq(wallets.id, parsedId))
      .get()

    if (!wallet) {
      throw createError({
        statusCode: 404,
        message: 'Wallet not found',
        name: 'WalletNotFoundError',
      })
    }
    return wallet
  }
})
