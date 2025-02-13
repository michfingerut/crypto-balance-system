type CoinEntry = {
  id: string;
  symbol: string;
  name: string;
};

type RateEnv = {
  rateRefreshInterval: number;
};

export { type CoinEntry, type RateEnv };
