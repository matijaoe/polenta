import { z } from 'zod'
import { ErrorCode } from '~/models/errors'
import { accountSchema } from '~/schema/account'
import type { AccountInsert } from '~/server/db/schema'
import { accounts } from '~/server/db/schema'
import { extractZodErrorMessage } from '~/server/utils'
import { db } from '~/server/utils/db'

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
    // UNIQUE constraint failed: accounts.wallet_id, accounts.derivation_path
    // UNIQUE constraint failed: accounts.xpub
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw createError({
        statusCode: 400,
        statusMessage: err.message.includes('xpub')
          ? 'Account with provided XPUB already exists'
          : 'Account with provided derivation path already exists',
        message: err.message,
        data: {
          errorCode: ErrorCode.DUPLICATE_ACCOUNT,
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
