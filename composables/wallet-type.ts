import type { ScriptType, ScriptTypeKey, WalletScriptModel } from '~/models'
import { SCRIPT_CONFIG } from '~/models'

export function useWalletType() {
  const walletTypes = computed<WalletScriptModel[]>(() => {
    return (Object.keys(SCRIPT_CONFIG) as ScriptTypeKey[]).map((key) => {
      const wallet = SCRIPT_CONFIG[key]
      return {
        id: wallet.code,
        addressFormat: wallet.addressFormat,
        branch: wallet.branch,
        extendedKey: wallet.extendedKey,
        label: wallet.label,
        help: `Address starts with ${wallet.addressFormat}`,
      } as WalletScriptModel
    })
  })

  const getWalletByType = (type: ScriptType) => {
    return walletTypes.value.find((wallet: WalletScriptModel) => wallet.id === type)
  }

  return {
    walletTypes,
    getWalletByType,
  }
}
