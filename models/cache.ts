/**
 * Represents a cache entry.
 */
export type CacheEntry<T = any> = {
  /**
   * The data stored in the cache entry.
   */
  data: T
}

/**
 * Represents the metadata for a cache entry.
 */
export type CacheMeta = {
  createdAt: number
}

/**
 * Defines the structure for data returned by the withCache function.
 */
export type CachedData<T> = {
  /**
   * Indicates if the data is stale (true if fetched from cache).
   */
  isStale: boolean

  /**
   * ISO string timestamp of when the data was last fetched.
   */
  lastFetched: Date

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
