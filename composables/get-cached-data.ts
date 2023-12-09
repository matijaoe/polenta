export const getCachedData = (key: string) => {
  const app = useNuxtApp()
  return app.payload.data[key] || app.static.data[key]
}
