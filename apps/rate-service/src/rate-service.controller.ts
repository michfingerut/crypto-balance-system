import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { RateService } from './rate-service.service';
import { GetRateDTO } from './dto/get-rate.dto';

@Controller('rate')
export class RateServiceController {
  private readonly logger = new CBSLogging(RateServiceController.name);
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getRate(@Query(ValidationPipe) query: GetRateDTO) {
    const { coin, vs_coin } = query;

    const res = this.rateService.getRate(coin, vs_coin);
    this.logger.log(`get rate ${coin}-${vs_coin}`);
    return res;
  }
}
