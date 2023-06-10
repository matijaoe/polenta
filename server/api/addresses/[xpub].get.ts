import { addressesFromExtPubKey } from '@swan-bitcoin/xpub-lib/lib/derivation.js'
import { Purpose } from '@swan-bitcoin/xpub-lib/lib/purpose.js'
import type { AddressBasic } from '../../../models'

export default defineEventHandler((event) => {
  const { xpub } = event.context.params as { xpub: string }

  try {
    const addresses = addressesFromExtPubKey({
      extPubKey: xpub,
      network: 'mainnet',
      addressCount: 4,
      purpose: Purpose.P2WPKH,
    }) as AddressBasic[]

    return addresses ?? []
  } catch (error) {
    console.error(error)
    return []
  }
})
