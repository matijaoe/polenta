import { z } from 'zod'
import { ErrorCode } from '~/models'
import { accountSchema } from '~/schema/account'
import type { AccountInsert } from '~/server/db/schema'
import { accounts } from '~/server/db/schema'

export default defineEventHandler(async (event) => {
  const body = await readBody<AccountInsert>(event)

  try {
    const validatedAccount = accountSchema.parse(body)

    const createdAccount = db
      .insert(accounts)
      .values(validatedAccount)
      .returning()
      .get()

    return createdAccount
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        message: extractZodErrorMessage(err),
        data: {
          errorCode: ErrorCode.VALIDATION_ERROR,
        }
      })
    }
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
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
        }
      })
    } else if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
      throw createError({
        statusCode: 400,
        statusMessage: err.message,
        message: 'Wallet with provided ID does not exist',
        data: {
          errorCode: ErrorCode.NOT_FOUND,
        }
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
