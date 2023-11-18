import type { CachedData } from './cache'
import type { WithOptional } from '.'

export type XpubAddressesResponse = {
  xfp: string
  xpub: string
  addresses: string[]
}

export type AddressStatsResponse = CachedData<AddressStatsData[]>

export type AddressStatsData = {
  address: string
  stats: AddressStats
}

export type AddressOptionalStatsData = WithOptional<AddressStatsData, 'stats'>

export type AddressStats = {
  balance: number
  spentTxoCount: number
  spentTxoSum: number
  fundedTxoCount: number
  fundedTxoSum: number
  txCount: number
}
