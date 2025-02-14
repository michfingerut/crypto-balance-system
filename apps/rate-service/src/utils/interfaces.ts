interface CoinEntry {
  id: string;
  symbol: string;
  name: string;
}

interface RateEnv {
  rateRefreshInterval: number;
  serverPort: number;
}

interface CryptoRateResponse {
  [key: string]: { [vsCurrency: string]: number };
}

export { CoinEntry, RateEnv, CryptoRateResponse };
