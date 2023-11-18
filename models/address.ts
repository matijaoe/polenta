export type AddressStatsResponse = {
  address: string
  stats: AddressStats
}

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>


export type AddressOptionalStatsResponse = WithOptional<AddressStatsResponse, 'stats'>

export type AddressStats = {
  balance: number
  spentTxoCount: number
  spentTxoSum: number
  fundedTxoCount: number
  fundedTxoSum: number
  txCount: number
}
