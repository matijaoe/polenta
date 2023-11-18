import { address } from 'bitcoinjs-lib'
import type { AddressStatsData } from '../../../models'
import { useCache } from '~/server/utils/cache'
import { mempool } from '~/server/utils/mempool-space'
import { createHash } from '~/utils/hash'

export default defineEventHandler(async (event) => {
  const { address: addressParam } = event.context.params as { address: string }

  try {
    const fetchAddressStats = async () => {
      const res = await mempool.bitcoin.addresses.getAddress({ address: addressParam })

      const {
        address,
        chain_stats: {
          funded_txo_count: fundedTxoCount,
          funded_txo_sum: fundedTxoSum,
          spent_txo_count: spentTxoCount,
          spent_txo_sum: spentTxoSum,
          tx_count: txCount
        }
      } = res

      const balance = fundedTxoSum - spentTxoSum

      const stats = {
        balance,
        spentTxoCount,
        spentTxoSum,
        fundedTxoCount,
        fundedTxoSum,
        txCount
      }

      return { address, stats } as AddressStatsData
    }

    const hash = createHash(addressParam)
    return useCache(`address_stats_${hash}`, fetchAddressStats)
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
