import {
  Controller,
  Get,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CBSLogging } from '@app/shared/logging/logging.service';
import { CBSError } from '@app/shared/error/error.service';

import { RateService } from './rate-service.service';
import { GetRateDTO } from './dto/get-rate.dto';
import { GetRateDocs, GetCoinListDocs } from './swagger/rate.swagger';

@Controller('rate')
@UseFilters(CBSError)
@ApiTags('Rate')
export class RateServiceController {
  constructor(
    private readonly rateService: RateService,
    private readonly logger: CBSLogging,
  ) {}

  @Get()
  @GetRateDocs()
  async getRate(@Query(ValidationPipe) query: GetRateDTO) {
    const { coin, vs_coin } = query;
    const res = await this.rateService.getRate(coin, vs_coin);
    this.logger.log(`get rate ${coin}-${vs_coin}`);
    return res;
  }

  @Get('/coin-list')
  @GetCoinListDocs()
  async getCoinList() {
    const res = await this.rateService.getCoinList();
    this.logger.log(`get coin list`);
    return res;
  }
}
