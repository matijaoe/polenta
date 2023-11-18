import { mapToObject } from '~/utils'

export default defineEventHandler(() => {
  return {
    cache: mapToObject(CACHE)
  }
})
