import { z } from 'zod'
import { ErrorCode } from '~/models'

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({ xpub: z.string() }).safeParse)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Validation error',
      message: 'xpub not provided',
      data: {
        errorCode: ErrorCode.VALIDATION_ERROR,
      }
    })
  }

  const { xpub } = query.data

  return {
    xpub,
    isValid: validateXpub(xpub),
  }
})
