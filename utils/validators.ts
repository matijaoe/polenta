export function validateXpub(value?: string) {
  if (!value)
    return false
  const regex = /^xpub[1-9A-HJ-NP-Za-km-z]{107}$/
  return regex.test(value)
}

export function validateDerivation(value?: string) {
  if (!value)
    return false
  const regex = /^m\/[0-9]+'?\/[0-9]+'?\/[0-9]+'?\/[0-9]+'?$/
  return regex.test(value)
}

export function validateFingerprint(value?: string) {
  if (!value)
    return false
  const regex = /^[0-9a-fA-F]{6}$/
  return regex.test(value)
}
