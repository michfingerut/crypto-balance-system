import { Controller, Get, Query } from '@nestjs/common';
import { RateServiceService } from './rate-service.service';

@Controller('rate')
export class RateServiceController {
  constructor(private readonly rateServiceService: RateServiceService) {}

  @Get()
  async getRate(@Query('coin') coin: string) {
    //TODO need to validate that coin exist
    return this.rateServiceService.getRate();
  }
}
