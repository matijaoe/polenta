import type { AddressStatsData } from '~/models'
import type { CachedData } from '~/models/cache'

export default defineEventHandler(async (event) => {
  const { addresses } = await readBody(event) as { addresses: string[] }

  try {
    const fetchAddressStats = async () => {
      // individual address endpoints handles caching
      const promises = addresses.map(address => $fetch<CachedData<AddressStatsData>>(`/api/address/${address}`))
      const res = await Promise.all(promises)
      return res.map(r => r.data)
    }

    return fetchAddressStats()
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
