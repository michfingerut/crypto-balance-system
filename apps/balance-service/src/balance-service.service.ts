import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { CreateAssetDto } from './dto/create-asset.dto';
import { CBSLogging } from '@app/shared/logging/logging.controller';
import { CBSError } from '@app/shared/error/error.controller';

//TODO:
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
  private logger: CBSLogging;
  private readonly errCo = new CBSError();

  constructor(logger: CBSLogging) {
    this.logger = logger;
  }

  async getAssets(userId: string): Promise<BalanceEntry[]> {
    const data = await this.readDataFromFile();
    return data.filter((entry) => entry.userId === userId);
  }

  async addAssets(userId: string, data: CreateAssetDto): Promise<BalanceEntry> {
    //Generate ID for the assset
    const balanceEntries = await this.readDataFromFile();
    const newId = balanceEntries.length + 1;

    const newEntry: BalanceEntry = { ...data, userId, id: newId };
    balanceEntries.push(newEntry);

    await this.writeDataToFile(balanceEntries);
    return newEntry;
  }

  async removeAssets(id: number, userId: string): Promise<BalanceEntry | {}> {
    //check if user exist in the file
    const balanceEntries = await this.readDataFromFile();
    const index = balanceEntries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      //if not exist, return 200 and empty object
      return {};
    }

    if (balanceEntries[index].userId !== userId) {
      const message = 'Cant remove the asset';
      this.logger.error(message);
      this.errCo.errHandler(message, HttpStatus.FORBIDDEN);
    }

    const [removedEntry] = balanceEntries.splice(index, 1);
    await this.writeDataToFile(balanceEntries);
    return removedEntry;
  }

  private async readDataFromFile(): Promise<BalanceEntry[]> {
    try {
      const fileContent = await fs.readFile(this.dataFilePath, 'utf-8');
      return JSON.parse(fileContent) || [];
    } catch (error) {
      const message = `Error reading from file:${error}`;
      this.logger.error(message);
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
      const message = `Error reading from file:${error}`;
      this.logger.error(message);
      this.errCo.errHandler(message);
    }
  }
}
