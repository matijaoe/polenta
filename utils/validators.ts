export function validateXpub(value?: string) {
  if (!value)
    return false
  const regex = /^xpub[1-9A-HJ-NP-Za-km-z]{107}$/
  return regex.test(value)
}

export function validateWalletDerivation(value?: string) {
  if (!value)
    return false
  const regex = /^m\/[0-9]+'?\/[0-9]+'?\/[0-9]+'?$/
  // same regex, but witout last character
  return regex.test(value)
}

export function validateFingerprint(value?: string) {
  if (!value)
    return false
  const regex = /^[0-9a-fA-F]{8}$/
  return regex.test(value)
}
