export default defineEventHandler(() => {
  const { xpub } = useQueryParams<{ xpub: string }>()

  return {
    xpub,
    isValid: validateXpub(xpub),
  }
})
