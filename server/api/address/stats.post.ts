import type { AddressStatsData } from '~/models'
import type { CachedData } from '~/models/cache'
import { ErrorCode } from '~/models/errors'

const fetchAddressStats = async (address: string) => {
  return $fetch<CachedData<AddressStatsData>>(`/api/address/${address}`)
}

export default defineEventHandler(async (event) => {
  const { addresses } = await readBody(event) as { addresses: string[] }

  try {
    const promises = addresses.map(fetchAddressStats)
    const res = await Promise.all(promises)

    return {
      // not great, good for now
      ...res.at(0),
      data: res.map((r) => r.data),
    }
  } catch (err: any) {
    // TODO: error isn't being caught
    if (err?.response?.data) {
      throw createError({
        statusCode: 400,
        statusMessage: err.response?.data,
      })
    } else {
      throw createError({
        statusCode: 500,
        message: err.message,
        data: {
          errorCode: ErrorCode.UNKNOWN_ERROR
        }
      })
    }
  }
})
