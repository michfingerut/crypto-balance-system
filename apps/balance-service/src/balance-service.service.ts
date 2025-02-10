import { Injectable } from '@nestjs/common';

interface BalanceEntry {
  userId: string;
  coin: string;
  amount: number;
}
@Injectable()
export class BalanceDataService {
  async getAssets(userId: string): Promise<BalanceEntry[]> {
    return [
      {
        userId: userId,
        coin: 'aaa',
        amount: 0,
      },
    ];
  }

  async addAssets(
    userId: string,
    data: Omit<BalanceEntry, 'userId'>,
  ): Promise<BalanceEntry> {
    return { userId: userId, ...data };
  }

  async removeAssets(userId: string): Promise<BalanceEntry> {
    return { userId: userId, amount: 0, coin: 'aaa' };
  }
}
