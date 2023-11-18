import { formatISO, secondsToMilliseconds } from 'date-fns'

// TODO: use a map instead
const cache: Record<string, { data: any; cachedAt: number }> = {}
const DEFAULT_RATE_LIMIT_SECONDS = 15

const formatCachedAt = (cachedAt?: number) => {
  const date = cachedAt ? new Date(cachedAt) : new Date()
  return formatISO(date)
}

export const useCache = async <T = any>(
  cacheKey: string,
  fetchData: () => Promise<T>,
  options: {
    rateLimit: number
  } = {
    rateLimit: DEFAULT_RATE_LIMIT_SECONDS,
  }
): Promise<{ cached: boolean; message: string; cachedAt: string; data: T }> => {
  const rateLimitMsg = `rate limit: ${options.rateLimit}s`

  const currentTime = Date.now()
  const cacheEntry = cache[cacheKey]

  if (cacheEntry && currentTime - cacheEntry.cachedAt < secondsToMilliseconds(options.rateLimit)) {
    return {
      cached: true,
      message: `Data retrieved from cache (${rateLimitMsg})`,
      cachedAt: formatCachedAt(cacheEntry.cachedAt),
      data: cacheEntry.data as T,
    }
  }

  const newData = await fetchData()
  cache[cacheKey] = {
    data: newData,
    cachedAt: Date.now(),
  }

  return {
    cached: false,
    message: `Data cached locally (${rateLimitMsg})`,
    cachedAt: formatCachedAt(currentTime),
    data: newData,
  }
}
