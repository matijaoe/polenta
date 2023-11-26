import { ErrorCode } from '~/models'
import { accountSchema, walletSchema } from '~/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<{
    wallet: WalletInsert
    account: Omit<AccountInsert, 'walletId' >
  }>(event)

  // Store the original error caught inside the transaction block
  let originalError: any = null

  try {
    const validatedWallet = walletSchema.parse(body.wallet)

    const res = db.transaction((tx) => {
      try {
        const createdWallet = tx
          .insert(wallet_table)
          .values(validatedWallet)
          .returning()
          .get()

        const accountDto = {
          ...body.account,
          walletId: createdWallet.id,
        }

        const validatedAccount = accountSchema.parse(accountDto)

        const createdAccount = tx
          .insert(account_table)
          .values(validatedAccount)
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
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error - status message',
        message: extractZodErrorMessage(err),
        data: {
          errorCode: ErrorCode.VALIDATION_ERROR,
        }
      })
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
