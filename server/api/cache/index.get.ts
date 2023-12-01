import { mapToObject } from '~/utils'

export default defineEventHandler(async () => {
  const keys = await useCache().getKeys()
  return {
    cache: keys
  }
})
