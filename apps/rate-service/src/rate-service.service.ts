import { CBSError } from '@app/shared/error/error.service';
import { CBSLogging } from '@app/shared/logging/logging.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';
import { Cache } from 'cache-manager';
@Injectable()
export class RateService {
  private errCo: CBSError;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
    this.errCo = new CBSError(new CBSLogging(RateService.name));
  }

  async getRate(coin: string, vsCoin: string) {
    const cacheKey = ``;

    const cachedRates = await this.cacheManager.get(cacheKey);
    if (cachedRates) {
      return cachedRates;
    }

    try {
    } catch (error) {
      this.errCo.errHandler('Not found coins', HttpStatus.NOT_FOUND);
    }
  }
}
