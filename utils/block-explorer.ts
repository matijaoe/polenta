export const blockExplorerAddressUrl = (address: string) => {
  const blockExplorer = 'https://mempool.space/address'
  return `${blockExplorer}/${address}`
}
