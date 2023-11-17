import type { AddressStatsResponse } from '../../../models'
import { mempool } from '~/server/utils/mempool-space'

export default defineEventHandler(async (event) => {
  const { address: addressParam } = event.context.params as { address: string }

  try {
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

    return {
      address,
      stats: {
        balance,
        spentTxoCount,
        spentTxoSum,
        fundedTxoCount,
        fundedTxoSum,
        txCount
      }
    } as AddressStatsResponse
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
