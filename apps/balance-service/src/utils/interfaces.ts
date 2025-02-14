interface BalanceEntry {
  userId: string;
  coin: string;
  amount: number;
  id: number;
}

interface BalanceEnv {
  serverPort: number;
  rateServerUrl: string;
}

export { BalanceEntry, BalanceEnv };
