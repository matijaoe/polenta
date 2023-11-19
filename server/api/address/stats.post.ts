import type { AddressStatsData } from '~/models'
import type { CachedData } from '~/models/cache'

const fetchAddressStats = async (address: string) => {
  return $fetch<CachedData<AddressStatsData>>(`/api/address/${address}`)
}

export default defineEventHandler(async (event) => {
  const { addresses } = await readBody(event) as { addresses: string[] }

  try {
    const promises = addresses.map(fetchAddressStats)
    const res = await Promise.all(promises)

    return res.map(r => r.data)
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
