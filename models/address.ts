import type { CachedData } from './cache'
import type { Script, WithOptional } from '.'

export type AdressData = {
  index: number
  address: string | null
}

export type XpubAddressesResponse = {
  xpub: string
  addresses: AdressData[]
  type: 'receiving' | 'change'
  script: Script
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
