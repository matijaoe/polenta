import { looseToNumber } from '@nuxt/ui/dist/runtime/utils'
import { toNumber } from 'utilipea'

export const blockExplorerAddressUrl = (address: string) => {
  const blockExplorer = new URL(`https://mempool.space/address/${address}`)
  return blockExplorer.toString()
}

export const validateXpubClientSide = async (xpub: string) => {
  const data = await $fetch(`/api/validate-xpub`, {
    query: { xpub },
  })
  return data.isValid
}

export const getAccountIndexFromDerivationPath = (derivationPath: string) => {
  const accIdx = derivationPath.split('/').at(3)?.replace(/['h]/, '')
  return toNumber(accIdx)
}
