export const useBitcoinExchangeRate = async () => {
  const res = await useFetch('/api/bitcoin/exchange-rate', {
    key: 'bitcoin-exchange-rate',
    lazy: true,
    pick: ['bpi', 'time'],
  })

  return res
}
