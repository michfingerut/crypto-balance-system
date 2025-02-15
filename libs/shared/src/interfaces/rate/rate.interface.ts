export interface CoinEntry {
  id: string;
  symbol: string;
  name: string;
}

export interface CryptoRateResponse {
  [key: string]: { [vsCurrency: string]: number };
}