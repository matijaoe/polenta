export enum Script {
  legacy = 'p2pkh',
  segwit = 'p2sh-p2wpkh',
  native_segwit = 'p2wpkh',
  taproot = 'p2tr',
}

export type ScriptConfigValue = {
  derivationPath: string
  extendedKey: string
  label: string
  addressFormat: string
}

export type ScriptSelectItem = ScriptConfigValue & { value: Script }

export const SCRIPT_CONFIG: Record<Script, ScriptConfigValue> = {
  [Script.legacy]: {
    derivationPath: `m/44'/0'/0'`,
    extendedKey: 'xpub',
    label: 'Legacy',
    addressFormat: '1',
  },
  [Script.segwit]: {
    derivationPath: `m/49'/0'/0'`,
    extendedKey: 'ypub',
    label: 'Segwit',
    addressFormat: '3',
  },
  [Script.native_segwit]: {
    derivationPath: `m/84'/0'/0'`,
    extendedKey: 'zpub',
    label: 'Native Segwit',
    addressFormat: 'bc1q',
  },
  [Script.taproot]: {
    derivationPath: `m/86'/0'/0'`,
    extendedKey: 'zpub',
    label: 'Taproot',
    addressFormat: 'bc1p',
  },
}
