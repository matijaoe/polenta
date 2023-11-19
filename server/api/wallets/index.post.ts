import { z } from 'zod'
import { accountSchema } from '~/schema/account'
import { walletSchema } from '~/schema/wallet'
import type { AccountInsert, WalletInsert } from '~/server/db/schema'
import { accounts, wallets } from '~/server/db/schema'
import { extractZodErrorMessage } from '~/server/utils'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    wallet: WalletInsert
    account: Omit<AccountInsert, 'walletId'>
  }>(event)

  // Store the original error caught inside the transaction block
  let originalError: any = null

  try {
    const validatedWallet = walletSchema.parse(body.wallet)

    const res = await db.transaction(async (tx) => {
      try {
        const createdWallet = tx
          .insert(wallets)
          .values(validatedWallet)
          .returning()
          .get()

        const accountDto = {
          ...body.account,
          walletId: createdWallet.id,
        }

        const validatedAccount = accountSchema.parse(accountDto)

        const createdAccount = tx
          .insert(accounts)
          .values(validatedAccount)
          .returning()
          .get()

        return {
          wallet: createdWallet,
          account: createdAccount,
        }
      } catch (err: any) {
        console.error('inner', err.code)
        originalError = err
        tx.rollback()
      }
    })

    return res
  } catch (err: any) {
    if (originalError) {
      // eslint-disable-next-line no-ex-assign
      err = originalError
    }
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        message: extractZodErrorMessage(err),
      })
    }
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Duplicate account',
        message: 'Account with provided XPUB already exists',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})
