export type BitcoinPriceResponseModel = {
  time: BitcoinPriceResponseModelTime
  disclaimer: string
  chartName: string
  bpi: BitcoinPriceResponseModelBpi
}

export type BitcoinPriceResponseModelBpi = {
  USD: BitcoinPriceResponseModelCurrency
  GBP: BitcoinPriceResponseModelCurrency
  EUR: BitcoinPriceResponseModelCurrency
}

export type BitcoinPriceResponseModelCurrency = {
  code: string
  symbol: string
  rate: string
  description: string
  rate_float: number
}

export type BitcoinPriceResponseModelTime = {
  updated: string
  updatedISO: string
  updateduk: string
}
