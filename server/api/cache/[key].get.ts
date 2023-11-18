export default defineEventHandler(() => {
  const { key } = useParams<{ key: string }>()

  const entry = CACHE.get(key)

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
