import { z } from 'zod'
import { ScriptType } from '~/models'

export type QueryParams = {
  script: ScriptType
  type: 'receive' | 'change'
  limit: number
  gap: number
}

const zodSchema = z.object({
  script: z.nativeEnum(ScriptType).optional().default(ScriptType.native_segwit),
  type: z.enum(['receive', 'change']).optional().default('receive'),
  limit: z.number().min(1).max(HARD_ADDRESS_COUNT_LIMIT).optional().default(10),
  gap: z.number().min(0).optional().default(0),
})

export default defineEventHandler(async (event) => {
  const { xpub } = event.context.params as { xpub: string }
  const rawParams = useQueryParams<Partial<QueryParams>>(event)

  try {
    const { script, type, gap, limit } = zodSchema.parse(rawParams)

    const addresses = generateAddressesFromXpub(xpub, { script, type, gap, limit })

    return {
      xpub,
      addresses,
      type,
      script,
    }
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