import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { promises as fs } from 'fs';
import * as path from 'path';

import { CBSError } from '@app/shared/error/error.service';
import { CBSLogging } from '@app/shared/logging/logging.service';

import { CreateAssetDto } from './dto/create-asset.dto';
import { type BalanceEntry } from './utils/types';
import { BalanceServiceController } from './balance-service.controller';

@Injectable()
export class BalanceDataService {
  private readonly dataFilePath = path.join(
    __dirname,
    '..',
    'data',
    'balanceData.json',
  );
  private errCo: CBSError;
  //TODO:env
  private readonly rateServiceUrl = 'http://localhost:3000/rate';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: CBSLogging,
  ) {
    this.logger.setContext(BalanceServiceController.name);
    this.errCo = new CBSError(this.logger);
  }

  async getAssets(userId: string): Promise<BalanceEntry[]> {
    const data = await this.readDataFromFile();
    return data.filter((entry) => entry.userId === userId);
  }

  async getCalculation(userId: string, vsCoin: string) {
    const ratesMap = new Map<string, number>();
    try {
      const assets = await this.getAssets(userId);
      let value = 0;

      for (const asset of assets) {
        const { coin } = asset;
        let rate = ratesMap.get(coin);

        if (rate === undefined) {
          const res = (
            await axios.get(
              `${this.rateServiceUrl}?coin=${coin}&vs_coin=${vsCoin}`,
              {
                headers: {
                  'X-User-ID': userId,
                },
              },
            )
          ).data;
          rate = res[coin][vsCoin];
          ratesMap.set(coin, rate!); //if rate doesnt exist, rate-service throws exception
        }

        value += rate! * asset.amount;
      }

      return { value };
    } catch (err) {
      this.errCo.errHandler('Coin doesnt exist', HttpStatus.BAD_REQUEST);
    }
  }

  async addAssets(userId: string, data: CreateAssetDto): Promise<BalanceEntry> {
    await this.validateCoinExists(data.coin, userId);

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
      this.errCo.errHandler('Cant remove the asset', HttpStatus.FORBIDDEN);
    }

    const [removedEntry] = balanceEntries.splice(index, 1);
    await this.writeDataToFile(balanceEntries);
    return removedEntry;
  }

  //TODO: file operation should move to shared libs

  private async readDataFromFile(): Promise<BalanceEntry[]> {
    try {
      const fileContent = await fs.readFile(this.dataFilePath, 'utf-8');
      return JSON.parse(fileContent);
    } catch (error) {
      this.errCo.errHandler(`Error reading from file:${error}`);
      return [];
    }
  }

  //TODO: file operation should move to shared libs

  private async writeDataToFile(data: BalanceEntry[]): Promise<void> {
    try {
      await fs.writeFile(
        this.dataFilePath,
        JSON.stringify(data, null, 2),
        'utf-8',
      );
    } catch (error) {
      this.errCo.errHandler(`Error reading from file:${error}`);
    }
  }

  private async validateCoinExists(
    coin: string,
    userId: string,
  ): Promise<void> {
    const cacheKey = `coin-exists-${coin}`;

    const cachedExists = await this.cacheManager.get<boolean>(cacheKey);
    if (cachedExists) return;

    try {
      await axios.get(`${this.rateServiceUrl}/${coin}`, {
        headers: {
          'X-User-ID': userId,
        },
      });

      await this.cacheManager.set(cacheKey, true);
      return;
    } catch (error) {
      this.errCo.errHandler('Coin doesnt exist', HttpStatus.BAD_REQUEST);
    }
  }
}
