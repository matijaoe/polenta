/**
 * Converts a Map to an object.
 * @param map The Map to be converted.
 * @returns An object with keys and values from the Map.
 */
export const mapToObject = <K extends string | number | symbol, V>(map: Map<K, V>): Record<K, V> => {
  const object: Record<K, V> = {} as Record<K, V>
  map.forEach((value, key) => {
    object[key] = value
  })
  return object
}

export const validateXpubClientSide = async (xpub: string) => {
  const data = await $fetch(`/api/xpub/validate`, {
    query: {
      xpub,
    },
  })
  return data.isValid
}
