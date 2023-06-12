export type BitcoinPriceResponseModel = {
  time: Time
  disclaimer: string
  chartName: string
  bpi: Bpi
}

type Bpi = {
  USD: Eur
  GBP: Eur
  EUR: Eur
}

type Eur = {
  code: string
  symbol: string
  rate: string
  description: string
  rate_float: number
}

type Time = {
  updated: string
  updatedISO: string
  updateduk: string
}
