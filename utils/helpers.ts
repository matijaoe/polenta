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

export const generateIndices = ({ start = 0, count }: { start: number; count: number }) => {
  return Array.from({ length: count }).map((_, i) => start + i)
}

export const formatString = (str: string, n: number) => {
  if (str.length <= 2 * n) {
    return str
  }
  return `${str.slice(0, n)}...${str.slice(-n)}`
}
