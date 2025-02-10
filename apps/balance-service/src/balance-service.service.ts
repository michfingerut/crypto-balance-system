import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

export interface BalanceEntry {
  userId: string;
  coin: string;
  amount: number;
  id: number;
}
@Injectable()
export class BalanceDataService {
  private readonly dataFilePath = path.join(
    __dirname,
    '..',
    'data',
    'balanceData.json',
  );

  async getAssets(userId: string): Promise<BalanceEntry[]> {
    const data = await this.readDataFromFile();
    return data.filter((entry) => entry.userId === userId);
  }

  async addAssets(
    userId: string,
    data: Omit<BalanceEntry, 'userId' | 'id'>,
  ): Promise<BalanceEntry> {
    const balanceEntries = await this.readDataFromFile();
    const newId = balanceEntries.length + 1;
    const newEntry: BalanceEntry = { ...data, userId, id: newId };
    balanceEntries.push(newEntry);
    await this.writeDataToFile(balanceEntries);
    return newEntry;
  }

  async removeAssets(id: number): Promise<BalanceEntry> {
    return { userId: 'aaa', amount: 0, coin: 'aaa', id: 1 };
  }

  private async readDataFromFile(): Promise<BalanceEntry[]> {
    try {
      const fileContent = await fs.readFile(this.dataFilePath, 'utf-8');
      return JSON.parse(fileContent) || [];
    } catch (error) {
      throw new InternalServerErrorException('Error reading from file:', error);
    }
  }

  private async writeDataToFile(data: BalanceEntry[]): Promise<void> {
    try {
      await fs.writeFile(
        this.dataFilePath,
        JSON.stringify(data, null, 2),
        'utf-8',
      );
    } catch (error) {
      throw new InternalServerErrorException('Error reading from file:', error);
    }
  }
}
