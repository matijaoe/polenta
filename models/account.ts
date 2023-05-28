export type Account = {
  label: string
  scriptType: 'legacy' | 'segwit' | 'native segwit' | 'taproot'
  id: string
  walletId: string
}
