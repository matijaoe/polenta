import type { Script, ScriptConfigValue, WalletScriptModel } from '~/models'
import { SCRIPT_CONFIG } from '~/models'

export const useBitcoinScripts = () => {
  const entries = computed(() => (Object.entries(SCRIPT_CONFIG) as [Script, ScriptConfigValue][]))

  const scriptOptions = computed(() => entries.value
    .map(([code, value]) => ({
      value: code,
      ...value,
    })))

  const getScriptValue = (scriptValue?: Script) => {
    return scriptOptions.value.find((script) => script.value === scriptValue)
  }

  return {
    scriptOptions,
    getScriptValue,
  }
}
