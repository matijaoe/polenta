import type { Script } from './bitcoin'

export type Account = {
  label: string
  scriptType: Script
  id: string
  walletId: string
}
