import { formatDuration, formatISO, intervalToDuration, secondsToMilliseconds } from 'date-fns'
import type { CacheEntry, CachedData } from '~/models/cache'

const cache = new Map<string, CacheEntry>()

const DEFAULT_RATE_LIMIT_SECONDS = 15

const formatCachedAt = (cachedAt?: number) => {
  return formatISO(cachedAt ? new Date(cachedAt) : new Date())
}

type UseCacheOptions = {
  /**
   * The rate limit in seconds.
   */
  rateLimit: number
}

const DEFAULT_USE_CACHE_OPTIONS: UseCacheOptions = {
  rateLimit: DEFAULT_RATE_LIMIT_SECONDS,
}

/**
 * Caches the result of a function and returns the cached data if available and not stale.
 * If the data is not available in the cache or is stale, it fetches the data and updates the cache.
 *
 * @template T - The type of data being cached.
 * @param {string} cacheKey - The key used to identify the cached data.
 * @param {() => Promise<T>} fetchData - The function that fetches the data if it is not available in the cache.
 * @param {{ rateLimit: number }} [options] - The options for caching, including the rate limit in seconds.
 * @returns {Promise<CachedData<T>>} - A promise that resolves to the cached data.
 */
export const useCache = async <T = any>(
  cacheKey: string,
  fetchData: () => Promise<T>,
  options: UseCacheOptions = DEFAULT_USE_CACHE_OPTIONS
): Promise<CachedData<T>> => {
  const rateLimitMsg = `rate limit: ${options.rateLimit}s`
  const currentTime = Date.now()
  const cacheEntry = cache.get(cacheKey)

  if (cacheEntry && currentTime - cacheEntry.cachedAt < secondsToMilliseconds(options.rateLimit)) {
    const duration = intervalToDuration({ start: cacheEntry.cachedAt, end: currentTime }) || { seconds: 0 }
    const timeSinceLastFetch = formatDuration(duration)

    return {
      isStale: true,
      lastFetched: formatCachedAt(cacheEntry.cachedAt),
      timeSinceLastFetch,
      message: `Data retrieved from cache (${rateLimitMsg})`,
      data: cacheEntry.data as T,
    }
  }

  const newData = await fetchData()
  cache.set(cacheKey, {
    data: newData,
    cachedAt: currentTime,
  })

  return {
    isStale: false,
    lastFetched: formatCachedAt(currentTime),
    message: `Data fetched and cached (${rateLimitMsg})`,
    data: newData,
  }
}
