import { CACHE_MANAGER } from '@nestjs/cache-manager';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { type CoinEntry } from './utils/types';

@Injectable()
export class RateService {
  private readonly coinGeckoUrl = 'https://api.coingecko.com/api/v3';

  //cache for coins id
  private readonly coinListCacheKey = 'coin-gecko-coin-list';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: CBSLogging,
  ) {
    this.logger.setContext(RateService.name);
  }

  async getRate(coin: string, vsCoin: string) {
    let rates = [];
    const coinId = await this.getCoinId(coin);
    //cache for the coins rates
    const cacheKey = `crypto-rate-${coinId}-${vsCoin}`;

    const cachedRates = await this.cacheManager.get(cacheKey);
    if (cachedRates) {
      return cachedRates;
    }

    try {
      const response = await axios.get(`${this.coinGeckoUrl}/simple/price`, {
        params: { ids: coinId, vs_currencies: vsCoin },
      });

      rates = response.data;
    } catch (error) {
      throw new NotFoundException('Not found coins');
    }

    if (!rates[coinId][vsCoin]) {
      throw new NotFoundException('Not found vs-coins');
    }

    await this.cacheManager.set(cacheKey, rates[coinId], 600);

    return rates;
  }

  async getCoinList() {
    //using cache mechanism to cache the ids. so first, i check if the id exists, if not sending req to coin geko API
    const cachedCoinList: CoinEntry[] | null = await this.cacheManager.get(
      this.coinListCacheKey,
    );

    if (cachedCoinList) {
      return cachedCoinList;
    }

    const coinList: CoinEntry[] = (
      await axios.get(`${this.coinGeckoUrl}/coins/list`)
    ).data;
    await this.cacheManager.set(this.coinListCacheKey, coinList, 86400);

    return coinList;
  }

  private async getCoinId(coin: string) {
    const coinList = await this.getCoinList();

    const coinData = coinList.find(
      (c) => c.name.toLowerCase() === coin.toLowerCase(),
    );

    if (!coinData) {
      throw new NotFoundException('Not found coins');
    }

    return coinData!.id;
  }
}
