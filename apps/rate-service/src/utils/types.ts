type CoinEntry = {
  id: string;
  symbol: string;
  name: string;
};

type RateEnv = {
  rateRefreshInterval: number;
  serverPort: number;
};

export { type CoinEntry, type RateEnv };
