/**
 * Represents a cache entry.
 */
export type CacheEntry<T = any> = {
  /**
   * The data stored in the cache entry.
   */
  data: T
  /**
   * The timestamp when the data was cached.
   */
  cachedAt: number
}

/**
 * Defines the structure for data returned by the useCache function.
 */
export type CachedData<T> = {
  /**
   * Indicates if the data is stale (true if fetched from cache).
   */
  isStale: boolean

  /**
   * ISO string timestamp of when the data was last fetched.
   */
  lastFetched: string

  /**
   * Descriptive message about the data retrieval status.
   */
  message: string

  /**
   * Time elapsed since the data was last fetched, formatted as a string.
   * Optional: only present if applicable.
   */
  timeSinceLastFetch?: string

  /**
   * The actual data returned, of type T.
   */
  data: T
}
