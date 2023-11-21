import type { Script } from './script'

export type Account = {
  label: string
  scriptType: Script
  id: string
  walletId: string
}
