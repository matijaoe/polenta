/**
 * Represents cached data
 */
export type CachedData<T> = {
  /**
   * Whether the data was retrieved from cache
   */
  cached: boolean

  /**
   * The timestamp of the cached data
   */
  cachedAt: string

  /**
   * A message associated with the cached data
   */
  message: string

  /**
   * The actual data
   */
  data: T
}
