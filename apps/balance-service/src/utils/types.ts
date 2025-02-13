type BalanceEntry = {
  userId: string;
  coin: string;
  amount: number;
  id: number;
};

type BalanceEnv = {
  serverPort: number;
};

export { type BalanceEntry, type BalanceEnv };
