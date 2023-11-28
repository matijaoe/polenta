import { z } from 'zod'
import { ErrorCode, Script } from '~/models'
import { address_table } from '~/server/db/schema'

const schema = z.object({
  accountId: z.number(),
  script: z.nativeEnum(Script),
  xpub: z.string(),
  gapReceiving: z.number().min(0).optional().default(0),
  limitReceiving: z.number().min(1).optional().default(10),
  gapChange: z.number().min(0).optional().default(0),
  limitChange: z.number().min(1).optional().default(5),
})

export default defineEventHandler(async (event) => {
  const body = await readBody<z.infer<typeof schema>>(event)

  try {
    const parsedBody = schema.parse(body)
    const { accountId, script, xpub, gapChange, gapReceiving, limitChange, limitReceiving } = parsedBody

    const receivingAddresses = generateAddressesFromXpub(body.xpub, {
      script,
      type: 'receiving',
      limit: limitReceiving,
      gap: gapReceiving
    }).map((addr) => ({
      accountId,
      type: 0,
      index: addr.index,
      address: addr.address!,
    })).filter((item) => Boolean(item.address))

    const changeAddresses = generateAddressesFromXpub(xpub, {
      script,
      type: 'change',
      limit: limitChange,
      gap: gapChange
    }).map((addr) => ({
      accountId,
      type: 1,
      index: addr.index,
      address: addr.address!,
    })).filter((item) => Boolean(item.address))

    const res = await db.insert(address_table)
      .values([...receivingAddresses, ...changeAddresses])
      .execute()

    return res
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
