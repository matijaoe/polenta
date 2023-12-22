import { ErrorCode } from '~/models'
import type { AccountInsert, WalletInsert } from '~/models/db'
import { accountSchema, walletSchema } from '~/schema'
import { account_table, wallet_table } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    wallet: WalletInsert
    account: Omit<AccountInsert, 'walletId' >
  }>(event)

  // TODO: do i still need this after implementing safeParse
  // Store the original error caught inside the transaction block
  let originalError: any = null

  try {
    const walletParse = walletSchema.safeParse(body.wallet)
    if (!walletParse.success) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid wallet data',
        message: extractZodErrorMessage(walletParse.error),
        data: {
          errorCode: ErrorCode.VALIDATION_ERROR,
        }
      })
    }

    const wallet = walletParse.data

    const res = db.transaction((tx) => {
      try {
        const createdWallet = tx
          .insert(wallet_table)
          .values(wallet)
          .returning()
          .get()

        const accountDto = {
          ...body.account,
          walletId: createdWallet.id,
        }

        const accountParse = accountSchema.safeParse(accountDto)

        if (!accountParse.success) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Invalid account data',
            message: extractZodErrorMessage(accountParse.error),
            data: {
              errorCode: ErrorCode.VALIDATION_ERROR,
            }
          })
        }

        const account = accountParse.data

        const createdAccount = tx
          .insert(account_table)
          .values(account)
          .returning()
          .get()

        return {
          wallet: createdWallet,
          account: createdAccount,
        }
      } catch (err: any) {
        originalError = err
        tx.rollback()
        throw err
      }
    })

    return res
  } catch (err: any) {
    if (originalError) {
      // eslint-disable-next-line no-ex-assign
      err = originalError
    }
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Duplicate account',
        message: 'Account with provided XPUB already exists',
        status: 9999, // not returned
        statusText: 'Validation error - status text', // not returned
        name: 'ValidationError - name', // not returned
        data: {
          errorCode: ErrorCode.DUPLICATE_XPUB,
        },
        toJSON: () => ({
          statusCode: 400,
          statusMessage: 'Guzica',
          message: 'Account with provided XPUB already exists',
          data: {
            errorCode: ErrorCode.DUPLICATE_XPUB,
          }
        })
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
      data: {
        errorCode: ErrorCode.UNKNOWN_ERROR,
      }
    })
  }
})
