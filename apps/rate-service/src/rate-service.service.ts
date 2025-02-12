import { CACHE_MANAGER } from '@nestjs/cache-manager';
import axios from 'axios';
import { Cache } from 'cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';

import { CBSError } from '@app/shared/error/error.service';
import { CBSLogging } from '@app/shared/logging/logging.service';

import { type CoinEntry } from './utils/types';

@Injectable()
export class RateService {
  private readonly coinGeckoUrl = 'https://api.coingecko.com/api/v3';

  private errCo: CBSError;
  //cache for coins id
  private readonly coinListCacheKey = 'coin-gecko-coin-list';

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: CBSLogging,
  ) {
    this.logger.setContext(RateService.name);

    this.errCo = new CBSError(this.logger);
  }

  async isExist(coin: string) {
    return await this.getCoinId(coin);
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
      await this.cacheManager.set(cacheKey, rates);
    } catch (error) {
      this.errCo.errHandler('Not found coins', HttpStatus.NOT_FOUND);
    }

    if (!rates[coinId][vsCoin]) {
      this.errCo.errHandler('Not found vs-coins', HttpStatus.NOT_FOUND);
    }

    return rates;
  }

  private async getCoinList() {
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
      (c) =>
        c.name.toLowerCase() === coin.toLowerCase() ||
        c.id.toLowerCase() === coin.toLowerCase(),
    );

    if (!coinData) {
      this.errCo.errHandler('coin not found', HttpStatus.NOT_FOUND);
    }

    return coinData!.id;
  }
}
