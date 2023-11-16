export enum ScriptType {
  legacy = 'p2pkh',
  segwit = 'p2sh-p2wpkh',
  native_segwit = 'p2wpkh',
  taproot = 'p2tr',
}

export type ScriptTypeKey = 'legacy' | 'segwit' | 'native-segwit' | 'taproot'

export type ScriptTypeConfig = {
  branch: number
  extendedKey: string
  label: string
  addressFormat: string
  code: ScriptType
}

export const SCRIPT_CONFIG: Record<ScriptTypeKey, ScriptTypeConfig> = {
  'legacy': {
    branch: 44,
    extendedKey: 'xpub',
    label: 'Legacy',
    addressFormat: '1',
    code: ScriptType.legacy
  },
  'segwit': {
    branch: 49,
    extendedKey: 'ypub',
    label: 'Segwit',
    addressFormat: '3',
    code: ScriptType.segwit

  },
  'native-segwit': {
    branch: 84,
    extendedKey: 'zpub',
    label: 'Native Segwit',
    addressFormat: 'bc1q',
    code: ScriptType.native_segwit
  },
  'taproot': {
    branch: 86,
    extendedKey: 'zpub',
    label: 'Taproot',
    addressFormat: 'bc1p',
    code: ScriptType.taproot
  },
}

export type Account = {
  label: string
  scriptType: ScriptType
  id: string
  walletId: string
}
