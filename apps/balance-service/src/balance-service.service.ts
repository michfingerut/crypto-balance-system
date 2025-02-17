import {
  BadRequestException,
  ForbiddenException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import axios, { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import * as path from 'path';

import { CBSFileOpService } from '@app/shared/file-op/file-op.service';
import { CoinEntry } from '@app/shared/interfaces/rate/rate.interface';
import {
  AssetsCalc,
  BalanceEntry,
} from '@app/shared/interfaces/balance/balance.interface';

import { CreateAssetDto } from './dto/create-asset.dto';
import { EnvClass } from './config';
@Injectable()
export class BalanceDataService {
  private readonly dataFilePath = path.join(
    __dirname,
    '..',
    'data',
    'balanceData.json',
  );

  private readonly rateServiceUrl = EnvClass.getInstance().get('rateServerUrl');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly fileOp: CBSFileOpService<BalanceEntry>,
  ) {}

  async getAssets(userId: string): Promise<BalanceEntry[]> {
    const data = await this.fileOp.readDataFromFile(this.dataFilePath);
    return data.filter((entry) => entry.userId === userId);
  }

  async getCalculation(userId: string, vsCoin: string): Promise<AssetsCalc> {
    const ratesMap = new Map<string, number>();
    try {
      const assets = await this.getAssets(userId);
      let value = 0;

      for (const asset of assets) {
        const { coin } = asset;
        let rate = ratesMap.get(coin);

        if (rate === undefined) {
          const res = (
            await axios.get<CoinEntry[]>(
              `${this.rateServiceUrl}?coin=${coin}&vs_coin=${vsCoin}`,
              {
                headers: {
                  'X-User-ID': userId,
                },
              },
            )
          ).data;

          // on SUCCSSES, the object returned will have the vsCoin property
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          rate = res[vsCoin];

          ratesMap.set(coin, rate!); //if rate doesnt exist, rate-service throws exception
        }

        value += rate! * asset.amount;
      }

      return { value };
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === HttpStatus.NOT_FOUND
      ) {
        throw new BadRequestException('Coin doesnt exist');
      } else {
        throw err;
      }
    }
  }

  async addAssets(userId: string, data: CreateAssetDto): Promise<BalanceEntry> {
    await this.validateCoinExists(data.coin, userId);

    //Generate ID for the assset
    const balanceEntries = await this.fileOp.readDataFromFile(
      this.dataFilePath,
    );
    const newId = balanceEntries.length + 1;

    const newEntry: BalanceEntry = { ...data, userId, id: newId };
    balanceEntries.push(newEntry);

    await this.fileOp.writeDataToFile(balanceEntries, this.dataFilePath);

    return newEntry;
  }

  //empty object neess to be returned when the asset doesnt exist
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  async removeAssets(id: number, userId: string): Promise<BalanceEntry | {}> {
    //check if user exist in the file
    const balanceEntries = await this.fileOp.readDataFromFile(
      this.dataFilePath,
    );
    const index = balanceEntries.findIndex((entry) => entry.id === id);
    if (index === -1) {
      //if not exist, return 200 and empty object
      return {};
    }

    if (balanceEntries[index].userId !== userId) {
      throw new ForbiddenException('Cant remove the asset');
    }

    const [removedEntry] = balanceEntries.splice(index, 1);
    await this.fileOp.writeDataToFile(balanceEntries, this.dataFilePath);
    return removedEntry;
  }

  private async validateCoinExists(
    coin: string,
    userId: string,
  ): Promise<void> {
    const cacheKey = `coin-exists-${coin}`;
    const coinListCacheKey = 'coin-list';

    // Check if the specific coin is cached
    const cachedExists = await this.cacheManager.get<boolean>(cacheKey);
    if (cachedExists) return;

    // Check if the full coin list is cached
    let coinList = await this.cacheManager.get<CoinEntry[]>(coinListCacheKey);

    if (!coinList) {
      try {
        const response: AxiosResponse<CoinEntry[]> = await axios.get(
          `${this.rateServiceUrl}/coin-list`,
          {
            headers: { 'X-User-ID': userId },
          },
        );

        coinList = response.data;
        await this.cacheManager.set(coinListCacheKey, coinList);
      } catch {
        throw new InternalServerErrorException('Failed to fetch coin list');
      }
    }

    // in that point of the code, the coinList is defined
    const coinData = coinList.find(
      (c) => c.name.toLowerCase() === coin.toLowerCase(),
    );

    if (!coinData) {
      throw new BadRequestException('Coin doesn’t exist');
    }

    await this.cacheManager.set(cacheKey, true);
  }
}
