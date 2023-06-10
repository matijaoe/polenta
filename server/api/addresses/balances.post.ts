import { $fetch } from 'ofetch'
import type { AddressBalance } from '../../../models'

// For some reason does not get called
export default defineEventHandler(async (event) => {
  const query = getQuery(event) as { addresses: string[] }

  const addresses = query.addresses ?? []

  if (!addresses.length)
    return {}

  const url = new URL('https://blockchain.info/balance')
  url.searchParams.set('active', addresses.join('|'))

  try {
    const res = await $fetch<Record<string, AddressBalance>>(url.href)
    return res as Record<string, AddressBalance>
  } catch (error) {
    console.error(error)
    return {}
  }
})
