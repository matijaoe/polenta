import { z } from 'zod';
import { BitcoinScriptCode } from '~/models';
import { formatZodValidationErrorMessage, useQueryParams } from '~/server/utils';
import { HARD_ADDRESS_COUNT_LIMIT, generateAddressesFromXpub } from '~/server/utils/bitcoin';

export type QueryParams = {
  script: BitcoinScriptCode,
  type: 'receive' | 'change'
  limit: number,
  gap: number
}

const zodSchema = z.object({
  script: z.enum(['p2pkh', 'p2sh-p2wpkh', 'p2wpkh', 'p2tr']).optional().default('p2wpkh'),
  type: z.enum(['receive', 'change']).optional().default('receive'),
  limit: z.number().min(1).max(HARD_ADDRESS_COUNT_LIMIT).optional().default(10),
  gap: z.number().min(0).optional().default(0),
});

export default defineEventHandler(async (event) => {
  const { xpub } = event.context.params as { xpub: string }
  const rawParams = useQueryParams<Partial<QueryParams>>(event)

  try {
    const { script, type, gap, limit } = zodSchema.parse(rawParams);

    const addresses = generateAddressesFromXpub(xpub, { script, type, gap, limit });

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

