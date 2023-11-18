import type { AddressStatsData } from '~/models'
import type { CachedData } from '~/models/cache'
import { useCache } from '~/server/utils/cache'
import { createHash } from '~/utils/hash'

export default defineEventHandler(async (event) => {
  const { addresses } = await readBody(event) as { addresses: string[] }

  try {
    const fetchAddressStats = async () => {
      const promises = addresses.map(address => $fetch<CachedData<AddressStatsData>>(`/api/address/${address}`))
      const res = await Promise.all(promises)
      return res.map(r => r.data)
    }
    const hash = createHash(addresses.join())
    return useCache(`addresses_stats_${hash}`, fetchAddressStats)
  } catch (err: any) {
    if (err?.response?.data) {
      throw createError({
        status: 400,
        statusMessage: err.response?.data,
      })
    } else {
      throw createError({
        status: 500,
        message: err.message
      })
    }
  }
})
