import type { WalletScriptType } from '~/models'

export function useWalletType() {
  const scriptTypeDerivationMap = {
    'legacy': {
      branch: 44,
      extendedKey: 'xpub',
      label: 'Legacy',
      addressFormat: '1',
    },
    'segwit': {
      branch: 49,
      extendedKey: 'ypub',
      label: 'Segwit',
      addressFormat: '3',

    },
    'native-segwit': {
      branch: 84,
      extendedKey: 'zpub',
      label: 'Native Segwit',
      addressFormat: 'bc1q',
    },
    'taproot': {
      branch: 86,
      extendedKey: 'zpub',
      label: 'Taproot',
      addressFormat: 'bc1p',
    },
  }

  const walletTypes = computed(() => {
    return (Object.keys(scriptTypeDerivationMap) as WalletScriptType[]).map((key) => {
      const wallet = scriptTypeDerivationMap[key]
      return {
        ...wallet,
        id: key,
        help: `Address starts with ${scriptTypeDerivationMap[key].addressFormat}`,
      }
    })
  })

  return {
    scriptTypeDerivationMap,
    walletTypes,
  }
}
