export const blockExplorerAddressUrl = (address: string) => {
  const blockExplorer = new URL('https://mempool.space/address')
  blockExplorer.pathname = address
  return blockExplorer.toString()
}

export const validateXpubClientSide = async (xpub: string) => {
  const data = await $fetch(`/api/xpub/validate`, {
    query: { xpub },
  })
  return data.isValid
}
