export default defineEventHandler(() => {
  const { key } = useParams<{ key: string }>()

  const cache = getCache()
  const entry = cache.get(key)

  if (entry) {
    return {
      key,
      entry,
    }
  }

  throw createError({
    statusCode: 404,
    message: `Cache entry not found for key: ${key}`,
  })
})
