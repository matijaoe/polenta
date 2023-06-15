import type { WalletScriptModel, WalletScriptType } from '~/models'

export function useWalletType() {
  const scriptTypeDerivationMap = {
    'legacy': {
      branch: 44,
      extendedKey: 'xpub',
      label: 'Legacy (P2PKH)',
      addressFormat: '1',
    },
    'segwit': {
      branch: 49,
      extendedKey: 'ypub',
      label: 'Segwit (P2SH-P2WPKH)',
      addressFormat: '3',

    },
    'native-segwit': {
      branch: 84,
      extendedKey: 'zpub',
      label: 'Native Segwit (P2WPKH)',
      addressFormat: 'bc1q',
    },
    'taproot': {
      branch: 86,
      extendedKey: 'zpub',
      label: 'Taproot (P2TR)',
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
      } as WalletScriptModel
    })
  })

  const getWalletByType = (type: WalletScriptType) => {
    return walletTypes.value.find(wallet => wallet.id === type)
  }

  return {
    scriptTypeDerivationMap,
    walletTypes,
    getWalletByType,
  }
}
