import { z } from 'zod'
import { ErrorCode, Script } from '~/models'
import { address_table } from '~/server/db/schema'

const addressSchema = z.object({
  script: z.nativeEnum(Script),
  xpub: z.string(),
  gapReceiving: z.number().min(0).optional().default(0),
  limitReceiving: z.number().min(1).optional().default(10),
  gapChange: z.number().min(0).optional().default(0),
  limitChange: z.number().min(1).optional().default(5),
})

const paramsSchema = z.object({
  id: z.coerce.number(z.string())
})

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParams(event, paramsSchema.safeParse)

  if (!params.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid ID',
      message: extractZodErrorMessage(params.error),
      data: {
        errorCode: ErrorCode.VALIDATION_ERROR
      }
    })
  }

  const { id: accountId } = params.data

  const bodyParse = await readValidatedBody(event, addressSchema.safeParse)

  if (!bodyParse.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid address data',
      message: extractZodErrorMessage(bodyParse.error),
      data: {
        errorCode: ErrorCode.VALIDATION_ERROR
      }
    })
  }

  const body = bodyParse.data

  const { script, xpub, gapChange, gapReceiving, limitChange, limitReceiving } = body

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

  try {
    const res = await db.insert(address_table)
      .values([...receivingAddresses, ...changeAddresses])
      .execute()

    return res
  } catch (err: any) {
    throw createError({
      statusCode: 500,
      message: err.message,
      data: {
        errorCode: ErrorCode.UNKNOWN_ERROR
      }
    })
  }
})
