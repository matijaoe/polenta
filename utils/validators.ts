export function validateXpub(value?: string) {
  if (!value)
    return false
  const regex = /^xpub[1-9A-HJ-NP-Za-km-z]{107}$/
  return regex.test(value)
}

export function validateWalletDerivation(value?: string) {
  if (!value)
    return false
    // Should accept m/84h/0h/0h and m/84'/0'/0' and m/84/0/0, any number from 0 to 2^31-1, m/84h/0'/0' or any mixing of ' and h is not okay
  const regex = /^m\/[0-9]+[',h]?\/[0-9]+[',h]?\/[0-9]+[',h]?$/
  // same regex, but witout last character
  return regex.test(value)
}

export function validateFingerprint(value?: string) {
  if (!value)
    return false
  const regex = /^[0-9a-fA-F]{8}$/
  return regex.test(value)
}
