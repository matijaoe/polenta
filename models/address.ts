export type AddressStatsResponse = {
  address: string
  stats: AddressStats
}

export type AddressOptionalStatsResponse = {
  address: string
  stats?: AddressStats
}

export type AddressStats = {
  balance: number
  spentTxoCount: number
  spentTxoSum: number
  fundedTxoCount: number
  fundedTxoSum: number
  txCount: number
}
