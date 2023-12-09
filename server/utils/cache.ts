import { differenceInMilliseconds, secondsToMilliseconds } from 'date-fns'
import type { CacheEntry } from '~/models/cache'

export const useCache = () => {
  return useStorage<CacheEntry>('data')
}

const DEFAULT_RATE_LIMIT_SECONDS = 5

type UseCacheOptions = {
  // seconds
  rateLimit: number
}

const DEFAULT_USE_CACHE_OPTIONS: UseCacheOptions = {
  rateLimit: DEFAULT_RATE_LIMIT_SECONDS,
}

export const withCache = async <T = any>(
  cacheKey: string,
  fetchData: () => Promise<T>,
  options: UseCacheOptions = DEFAULT_USE_CACHE_OPTIONS
// ): Promise<CachedData<T>> => {
): Promise<any> => {
  const rateLimit = `${options.rateLimit}s`

  const cacheEntry = await useCache().getItem<CacheEntry>(cacheKey)
  const meta = await useCache().getMeta(cacheKey)

  let isConsideredFreshEnough = false
  if (meta.atime && meta.mtime) {
    isConsideredFreshEnough = differenceInMilliseconds(new Date(), meta.mtime) < secondsToMilliseconds(options.rateLimit)
  }

  if (cacheEntry && isConsideredFreshEnough) {
    return {
      rateLimit,
      isStale: true,
      meta,
      data: cacheEntry.data as T,
    }
  }

  const data = await fetchData()
  await useCache().setItem(cacheKey, { data })

  // TODO: get types and response in order
  return {
    rateLimit,
    isStale: false,
    meta,
    data,
  }
}
