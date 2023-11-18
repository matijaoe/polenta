import { mapToObject } from '~/utils'

export default defineEventHandler(() => {
  const cache = getCache()
  return {
    cache: mapToObject(cache)
  }
})
