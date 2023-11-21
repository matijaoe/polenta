import type { Script } from './script'

export type Wallet = {
  label: string
  id: string
}

export type WalletScriptModel = {
  id: Script
  label: string
  branch: number
  extendedKey: string
  addressFormat: string
  help: string
}
