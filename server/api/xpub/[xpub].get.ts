import { z } from 'zod'
import type { XpubAddressesResponse } from '~/models'
import { Script } from '~/models'
import { calculateFingerprint } from '~/server/utils/bitcoin'

export type QueryParams = {
  script: Script
  type: 'receive' | 'change'
  limit: number
  gap: number
}

const zodSchema = z.object({
  script: z.nativeEnum(Script).optional().default(Script.native_segwit),
  type: z.enum(['receive', 'change']).optional().default('receive'),
  limit: z.number().min(1).max(HARD_ADDRESS_COUNT_LIMIT).optional().default(10),
  gap: z.number().min(0).optional().default(0),
})

export default defineEventHandler(async (event) => {
  const { xpub } = event.context.params as { xpub: string }
  const rawParams = useQueryParams<Partial<QueryParams>>()

  try {
    const { script, type, gap, limit } = zodSchema.parse(rawParams)

    const addresses = generateAddressesFromXpub(xpub, { script, type, gap, limit })

    const xfp = calculateFingerprint(xpub)

    return {
      xfp,
      xpub,
      addresses,
      type,
      script,
    } as XpubAddressesResponse
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const message = formatZodValidationErrorMessage(err)
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        message
      })
    }
    throw createError({
      statusCode: 500,
      message: err.message
    })
  }
})
