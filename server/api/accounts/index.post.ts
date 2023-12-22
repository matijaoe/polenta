import { ErrorCode } from '~/models'
import { accountSchema } from '~/schema'
import { account_table } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const bodyParse = await readValidatedBody(event, accountSchema.safeParse)

  if (!bodyParse.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid account data',
      message: extractZodErrorMessage(bodyParse.error),
      data: {
        errorCode: ErrorCode.VALIDATION_ERROR,
      }
    })
  }

  const accountData = bodyParse.data

  try {
    const createdAccount = db
      .insert(account_table)
      .values(accountData)
      .returning()
      .get()

    return createdAccount
  } catch (err: any) {
    switch (err.code) {
      case 'SQLITE_CONSTRAINT_UNIQUE': {
        const isXpubError = err.message.includes('xpub')
        throw createError({
          statusCode: 400,
          statusMessage: err.message,
          message: isXpubError
            ? 'Account with provided XPUB already exists'
            : 'Account with provided derivation path already exists',
          data: {
            errorCode: isXpubError
              ? ErrorCode.DUPLICATE_XPUB
              : ErrorCode.DUPLICATE_DERIVATION_PATH,
          },
        })
      }
      case 'SQLITE_CONSTRAINT_FOREIGNKEY': {
        throw createError({
          statusCode: 400,
          statusMessage: err.message,
          message: 'Wallet with provided ID does not exist',
          data: {
            errorCode: ErrorCode.NOT_FOUND,
          },
        })
      }
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
