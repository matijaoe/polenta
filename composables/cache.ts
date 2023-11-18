export const retrieveCached = <T = any>(key: string): T | null => {
  const nuxtApp = useNuxtApp()
  const value = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
  if (!value) {
    return null
  }
  return value as T
}
