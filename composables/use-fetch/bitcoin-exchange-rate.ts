export const useBitcoinExchangeRate = async () => {
  const res = await useFetch('/api/bitcoin/exchange-rate', {
    key: FetchKey.BitcoinExchangeRate,
    lazy: true,
    pick: ['bpi', 'time'],
  })

  return res
}
