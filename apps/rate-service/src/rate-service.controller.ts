import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { RateService } from './rate-service.service';
import { GetRateDTO } from './dto/get-rate.dto';

@Controller('rate')
export class RateServiceController {
  constructor(
    private readonly rateService: RateService,
    private readonly logger: CBSLogging,
  ) {
    this.logger.setContext(RateServiceController.name);
  }

  @Get()
  //TODO: consider letting send arrays of coins
  async getRate(@Query(ValidationPipe) query: GetRateDTO) {
    const { coin, vs_coin } = query;

    const res = this.rateService.getRate(coin, vs_coin);
    this.logger.log(`get rate ${coin}-${vs_coin}`);
    return res;
  }

  //TODO: add validation
  @Get(':coin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async getExist(@Param('coin') coin: string) {
    await this.rateService.isExist(coin);
    this.logger.log(`get exist ${coin}`);
  }
}
