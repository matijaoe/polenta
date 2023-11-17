import type { BitcoinPriceResponseModel } from '~/models'

export default defineEventHandler(async () => {
  const url = 'https://api.coindesk.com/v1/bpi/currentprice.json'
  const data = await $fetch<BitcoinPriceResponseModel>(url, {
    headers: {
      'Content-Type': 'application/javascript'
    },
    parseResponse: res => JSON.parse(res)
  })
  return data
})
