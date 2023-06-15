export type Wallet = {
  label: string
  id: string
}

export type WalletScriptType = 'legacy' | 'segwit' | 'native-segwit' | 'taproot'

export type WalletScriptModel = {
  label: string
  id: WalletScriptType
  branch: number
  extendedKey: string
  addressFormat: string
  help: string
}
