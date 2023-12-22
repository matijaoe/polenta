import { z } from 'zod'
import type { XpubAddressesResponse } from '~/models'
import { ErrorCode, Script } from '~/models'

const querySchema = z.object({
  script: z.nativeEnum(Script).optional().default(Script.native_segwit),
  type: z.enum(['receiving', 'change']).optional().default('receiving'),
  limit: z.number().min(1).max(HARD_ADDRESS_COUNT_LIMIT).optional().default(10),
  gap: z.number().min(0).optional().default(0),
})

export default defineEventHandler(async () => {
  const { xpub } = useParams<{ xpub: string }>()

  const rawQueryParams = useQueryParams<Partial<z.infer<typeof querySchema>>>()
  const paramsParse = querySchema.safeParse(rawQueryParams)

  if (!paramsParse.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid params',
      message: extractZodErrorMessage(paramsParse.error),
      data: {
        errorCode: ErrorCode.VALIDATION_ERROR
      }
    })
  }
  const { script, type, gap, limit } = paramsParse.data

  const addresses = generateAddressesFromXpub(xpub, { script, type, gap, limit })

  return {
    xpub,
    addresses,
    type,
    script,
  } as XpubAddressesResponse
})
