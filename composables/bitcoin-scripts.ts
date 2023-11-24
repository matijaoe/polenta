import type { Script, ScriptConfigValue, ScriptSelectItem } from '~/models'
import { SCRIPT_CONFIG } from '~/models'

export const useBitcoinScripts = () => {
  const entries = computed(() => (Object.entries(SCRIPT_CONFIG) as [Script, ScriptConfigValue][]))

  const scriptOptions = computed<ScriptSelectItem[]>(() => entries.value
    .map(([code, value]) => ({
      value: code,
      ...value,
    })))

  const getScriptValue = (scriptValue?: Script): ScriptSelectItem | undefined => {
    if (!scriptValue) {
      return undefined
    }
    return scriptOptions.value.find((script) => script.value === scriptValue)
  }

  return {
    scriptOptions,
    getScriptValue,
  }
}

export const useScript = (script?: MaybeRef<Script>) => {
  const { getScriptValue } = useBitcoinScripts()

  return computed(() => script ? getScriptValue(unref(script)) : undefined)
}
