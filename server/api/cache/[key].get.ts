import { ErrorCode } from '~/models'
import type { CacheEntry } from '~/models/cache'

export default defineEventHandler(async () => {
  const { key } = useParams<{ key: string }>()

  const entry = await useCache().getItem<CacheEntry>(key)
  const meta = await useCache().getMeta(key)

  if (entry) {
    return {
      key,
      entry,
      meta
    }
  }

  throw createError({
    statusCode: 404,
    message: `Cache entry not found for key: ${key}`,
    data: {
      errorCode: ErrorCode.NOT_FOUND
    }
  })
})
