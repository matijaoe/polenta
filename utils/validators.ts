export const fingerprintRegex = /^[0-9A-Fa-f]{8}$/
export const derivationPathRegex = /^m(\/\d+(['h])?)*$/

export const validateWalletDerivation = (value?: string) => {
  if (!value) {
    return false
  }
  return derivationPathRegex.test(value)
}

export const validateFingerprintFormat = (value?: string) => {
  if (!value) {
    return false
  }
  return fingerprintRegex.test(value)
}

export const parseBooleanQuery = (val?: string) => {
  return Boolean(val && !['false', '0', ''].includes(val.toString().trim().toLowerCase()))
}
