import type { ScriptType } from './account'

export type Wallet = {
  label: string
  id: string
}

export type WalletScriptModel = {
  id: ScriptType
  label: string
  branch: number
  extendedKey: string
  addressFormat: string
  help: string
}
