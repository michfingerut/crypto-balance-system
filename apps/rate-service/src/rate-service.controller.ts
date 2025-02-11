import { Controller, Get, Query } from '@nestjs/common';
import { RateService } from './rate-service.service';
import { CBSLogging } from '@app/shared/logging/logging.service';

@Controller('rate')
export class RateServiceController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getRate(@Query('coin') coin: string, @Query('vs_coin') vsCoin: string) {
    //TODO need to validate that coin exist
    return this.rateService.getRate(coin, vsCoin);
  }
}
