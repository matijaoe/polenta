export default defineEventHandler(async (event) => {
  const { addresses } = await readBody(event) as { addresses: string[] }

  try {
    const promises = addresses.map(address => $fetch(`/api/address/${address}`))
    const stats = Promise.all(promises)
    return stats
  } catch (err: any) {
    if (err?.response?.data) {
      throw createError({
        status: 400,
        statusMessage: err.response?.data,
      })
    } else {
      throw createError({
        status: 500,
        message: err.message
      })
    }
  }
})
