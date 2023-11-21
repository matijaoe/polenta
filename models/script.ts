export enum Script {
  legacy = 'p2pkh',
  segwit = 'p2sh-p2wpkh',
  native_segwit = 'p2wpkh',
  taproot = 'p2tr',
}

export type ScriptConfigValue = {
  branch: number
  extendedKey: string
  label: string
  addressFormat: string
}

export const SCRIPT_CONFIG: Record<Script, ScriptConfigValue> = {
  [Script.legacy]: {
    branch: 44,
    extendedKey: 'xpub',
    label: 'Legacy',
    addressFormat: '1',
  },
  [Script.segwit]: {
    branch: 49,
    extendedKey: 'ypub',
    label: 'Segwit',
    addressFormat: '3',
  },
  [Script.native_segwit]: {
    branch: 84,
    extendedKey: 'zpub',
    label: 'Native Segwit',
    addressFormat: 'bc1q',
  },
  [Script.taproot]: {
    branch: 86,
    extendedKey: 'zpub',
    label: 'Taproot',
    addressFormat: 'bc1p',
  },
}
