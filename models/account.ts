export type Account = {
  label: string
  scriptType: 'legacy' | 'segwit' | 'bech32' | 'taproot'
  id: string
  walletId: string
}
