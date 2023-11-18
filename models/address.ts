import type { WithOptional } from '.'

export type XpubAddressesResponse = {
  addresses: string[]
  xpub: string
}

export type AddressStatsResponse = {
  address: string
  stats: AddressStats
}

export type AddressOptionalStatsResponse = WithOptional<AddressStatsResponse, 'stats'>

export type AddressStats = {
  balance: number
  spentTxoCount: number
  spentTxoSum: number
  fundedTxoCount: number
  fundedTxoSum: number
  txCount: number
}
