import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { RateService } from './rate-service.service';
import { GetRateDTO } from './dto/get-rate.dto';
import { CBSError } from '@app/shared/error/error.service';

@Controller('rate')
@UseFilters(CBSError)
export class RateServiceController {
  constructor(
    private readonly rateService: RateService,
    private readonly logger: CBSLogging,
  ) {
    this.logger.setContext(RateServiceController.name);
  }

  @Get()
  async getRate(@Query(ValidationPipe) query: GetRateDTO) {
    const { coin, vs_coin } = query;

    const res = this.rateService.getRate(coin, vs_coin);
    this.logger.log(`get rate ${coin}-${vs_coin}`);
    return res;
  }

  @Get('/coin-list')
  async getCoinList() {
    const res = await this.rateService.getCoinList();
    this.logger.log(`get coin list`);

    return res;
  }
}
