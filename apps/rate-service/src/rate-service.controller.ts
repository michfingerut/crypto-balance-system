import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { RateService } from './rate-service.service';
import { CBSLogging } from '@app/shared/logging/logging.service';
import { GetRateDTO } from './dto/get-rate.dto';

@Controller('rate')
export class RateServiceController {
  constructor(private readonly rateService: RateService) {}

  @Get()
  async getRate(@Query(ValidationPipe) query: GetRateDTO) {
    //TODO need to validate that coin exist
    //TODO: logger
    const { coin, vs_coin } = query;

    return this.rateService.getRate(coin, vs_coin);
  }
}
