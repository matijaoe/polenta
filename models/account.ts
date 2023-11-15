export enum ScriptType {
  Legacy = 'legacy',
  SegWit = 'segwit',
  NativeSegWit = 'native-segwit',
  Taproot = 'taproot',
}

export type BitcoinScriptCode = 'p2pkh' | 'p2sh-p2wpkh' | 'p2wpkh' | 'p2tr'

export const ScriptConfig: Record<ScriptType, {
  label: string
  label_long: string
  address_format: string
  default_derivation_path: string
  name: string
  code: BitcoinScriptCode
}> = {
  legacy: {
    label: "Legacy",
    label_long: "Legacy",
    address_format: "1",
    default_derivation_path: "m/44'/0'/0'",
    name: "Pay-to-Public-Key-Hash",
    code: "p2pkh",
  },
  segwit: {
    label: "SegWit",
    label_long: "Segregated Witness",
    address_format: "3",
    default_derivation_path: "m/49'/0'/0'",
    name: "Pay-to-Witness-Public-Key-Hash nested in Pay-to-Script-Hash",
    code: "p2sh-p2wpkh",
  },
  "native-segwit": {
    label: "Native SegWit",
    label_long: "Native Segregated Witness",
    address_format: "bc1q",
    default_derivation_path: "m/84'/0'/0'",
    name: "Pay-to-Witness-Public-Key-Hash",
    code: "p2wpkh",
  },
  taproot: {
    label: "Taproot",
    label_long: "Taproot",
    address_format: "bc1p",
    default_derivation_path: "m/86'/0'/0'",
    name: "Pay-to-Taproot",
    code: "p2tr",
  }
}

export type Account = {
  label: string
  scriptType: ScriptType
  id: string
  walletId: string
}
