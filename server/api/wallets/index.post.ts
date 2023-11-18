import { z } from 'zod'
import { walletSchema } from '~/schema/wallets'
import { accounts, wallets } from '~/server/db/schema'
import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  try {
    const validatedWallet = walletSchema.parse(body)

    const res = await db.transaction(async (tx) => {
      const createdWallet = tx.insert(wallets).values(validatedWallet).returning().get()

      const createdAccount = tx.insert(accounts).values({
        walletId: createdWallet.id,
        index: 0,
        name: `First account ${createdWallet.name}`,
      }).returning().get()

      return {
        wallet: createdWallet,
        account: createdAccount,
      }
    })
    return res
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const errorMessages = err.errors.map((error: z.ZodIssue) => {
        if (!error.path?.length) {
          return error.message
        }
        return `Field <${error.path.join('.')}>: ${error.message}`
      })
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        message: errorMessages.join('; '),
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: err.message,
    })
  }
})
