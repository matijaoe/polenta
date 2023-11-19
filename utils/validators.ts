export const fingerprintRegex = /^[0-9A-Fa-f]{8}$/

export const validateWalletDerivation = (value?: string) => {
  if (!value) {
    return false
  }
  const regex = /^m(\/\d+(['])?)*$/
  return regex.test(value)
}

export const validateFingerprintFormat = (value?: string) => {
  if (!value) {
    return false
  }
  return fingerprintRegex.test(value)
}
