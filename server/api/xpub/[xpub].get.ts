import { z } from 'zod'
import type { XpubAddressesResponse } from '~/models'
import { ErrorCode, Script } from '~/models'

const schema = z.object({
  script: z.nativeEnum(Script).optional().default(Script.native_segwit),
  type: z.enum(['receiving', 'change']).optional().default('receiving'),
  limit: z.number().min(1).max(HARD_ADDRESS_COUNT_LIMIT).optional().default(10),
  gap: z.number().min(0).optional().default(0),
})

export default defineEventHandler(async () => {
  const { xpub } = useParams<{ xpub: string }>()
  const rawParams = useQueryParams<Partial<z.infer<typeof schema>>>()

  try {
    const { script, type, gap, limit } = schema.parse(rawParams)

    const addresses = generateAddressesFromXpub(xpub, { script, type, gap, limit })

    return {
      xpub,
      addresses,
      type,
      script,
    } as XpubAddressesResponse
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const message = extractZodErrorMessage(err)
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        message,
        data: {
          errorCode: ErrorCode.VALIDATION_ERROR
        }
      })
    }
    throw createError({
      statusCode: 500,
      message: err.message,
      data: {
        errorCode: ErrorCode.UNKNOWN_ERROR
      }
    })
  }
})
