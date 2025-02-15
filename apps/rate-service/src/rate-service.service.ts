import { CACHE_MANAGER } from '@nestjs/cache-manager';
import axios, { AxiosResponse } from 'axios';
import { Cache } from 'cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { CBSLogging } from '@app/shared/logging/logging.service';
import {
  CoinEntry,
  CryptoRateResponse,
} from '@app/shared/interfaces/rate/rate.interface';

import { ConfigUtils } from './config/config';

@Injectable()
export class RateService {
  private readonly coinGeckoUrl = 'https://api.coingecko.com/api/v3';
  private readonly coinListCacheKey = 'coin-gecko-coin-list';
  private readonly coinGekoGetRateRoute = '/simple/price';
  private readonly coinGekoGetListRoute = '/coins/list';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: CBSLogging,
  ) {
    this.logger.setContext(RateService.name);
  }

  async getRate(coin: string, vsCoin: string) {
    const coinId = await this.getCoinId(coin);
    const cacheKey = `crypto-rate-${coinId}`;

    const cachedRates =
      (await this.cacheManager.get<Record<string, number>>(cacheKey)) || {};

    if (cachedRates[vsCoin]) {
      return { [coinId]: { [vsCoin]: cachedRates[vsCoin] } };
    }

    try {
      const response: AxiosResponse<CryptoRateResponse> = await axios.get(
        `${this.coinGeckoUrl}${this.coinGekoGetRateRoute}`,
        {
          params: { ids: coinId, vs_currencies: vsCoin },
        },
      );

      const newRates = response.data?.[coinId];
      if (!newRates || newRates[vsCoin] === undefined) {
        throw new NotFoundException('Not found vs-coins');
      }

      cachedRates[vsCoin] = newRates[vsCoin];

      await this.cacheManager.set(cacheKey, cachedRates);
      return { [coinId]: { [vsCoin]: newRates[vsCoin] } };
    } catch {
      throw new NotFoundException('Not found coins');
    }
  }

  async getCoinList(): Promise<CoinEntry[]> {
    const cachedCoinList = await this.cacheManager.get<CoinEntry[]>(
      this.coinListCacheKey,
    );
    if (cachedCoinList) return cachedCoinList;

    const response: AxiosResponse<CoinEntry[]> = await axios.get(
      `${this.coinGeckoUrl}${this.coinGekoGetListRoute}`,
    );
    const coinList = response.data;
    await this.cacheManager.set(this.coinListCacheKey, coinList);
    return coinList;
  }

  private async getCoinId(coin: string): Promise<string> {
    const coinList = await this.getCoinList();
    const coinData = coinList.find(
      (c) => c.name.toLowerCase() === coin.toLowerCase(),
    );

    if (!coinData) {
      throw new NotFoundException('Not found coins');
    }
    return coinData.id;
  }

  private async getCachedKeys(): Promise<
    { coinId: string; vsCoins: string[] }[]
  > {
    const coinList = await this.getCoinList();
    const cacheEntries: { coinId: string; vsCoins: string[] }[] = [];

    for (const coin of coinList) {
      const cacheKey = `crypto-rate-${coin.id}`;
      const cachedRates =
        await this.cacheManager.get<Record<string, number>>(cacheKey);

      if (cachedRates) {
        cacheEntries.push({
          coinId: coin.id,
          vsCoins: Object.keys(cachedRates),
        });
      }
    }

    return cacheEntries;
  }

  // rateRefreshInterval will be a number
  @Interval(ConfigUtils.getInstance().get('rateRefreshInterval') as number)
  async refreshCryptoRates() {
    this.logger.log('Refreshing crypto rates...');
    const cacheEntries = await this.getCachedKeys();

    if (!cacheEntries.length) {
      this.logger.log('No cached rates found. Skipping refresh.');
      return;
    }

    for (const entry of cacheEntries) {
      try {
        const response: AxiosResponse<CryptoRateResponse> = await axios.get(
          `${this.coinGeckoUrl}/simple/price`,
          {
            params: {
              ids: entry.coinId,
              vs_currencies: entry.vsCoins.join(','),
            },
          },
        );

        const newRates = response.data?.[entry.coinId];
        if (newRates) {
          await this.cacheManager.set(`crypto-rate-${entry.coinId}`, newRates);
          this.logger.log(`Updated ${entry.coinId} rates successfully`);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          this.logger.error(
            `Failed to update rates for ${entry.coinId}: ${err.message}`,
          );
        }
      }
    }

    this.logger.log('Crypto rates refresh complete.');
  }
}
