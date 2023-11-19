import type { AddressStatsData } from '../../../models'
import { ErrorCode } from '~/models/errors'
import { createHash } from '~/utils/hash'

const fetchAddressStats = async (address: string) => {
  return await mempool.bitcoin.addresses.getAddress({ address })
}

export default defineEventHandler(async () => {
  const { address: addressParam } = useParams<{ address: string }>()

  try {
    const hash = createHash(addressParam)

    return useCache(`address_stats_${hash}`, async () => {
      const { address, chain_stats } = await fetchAddressStats(addressParam)

      const {
        funded_txo_count: fundedTxoCount,
        funded_txo_sum: fundedTxoSum,
        spent_txo_count: spentTxoCount,
        spent_txo_sum: spentTxoSum,
        tx_count: txCount
      } = chain_stats

      const balance = fundedTxoSum - spentTxoSum

      const stats = {
        balance,
        spentTxoCount,
        spentTxoSum,
        fundedTxoCount,
        fundedTxoSum,
        txCount
      }

      return {
        address,
        stats
      } as AddressStatsData
    })
  } catch (err: any) {
    if (err?.response?.data) {
      throw createError({
        statusCode: 400,
        statusMessage: err.response?.data,
      })
    } else {
      throw createError({
        statusCode: 500,
        message: err.message,
        data: {
          errorCode: ErrorCode.UNKNOWN_ERROR
        }
      })
    }
  }
})
