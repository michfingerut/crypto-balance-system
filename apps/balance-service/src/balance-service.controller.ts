import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Headers,
} from '@nestjs/common';
import { BalanceDataService } from './balance-service.service';

@Controller('balance')
export class BalanceServiceController {
  constructor(private readonly BalanceDataService: BalanceDataService) {}

  @Get() // /balance
  getAssetsOfUser(@Headers('X-User-ID') userId: string) {
    return [];
  }

  @Get('total') // /balance/total?coin=
  getCalculationOfTotalAssets(
    @Headers('X-User-ID') userId: string,
    @Query('coin') coin: 'USD' | 'EUR' | 'NIS',
  ) {
    //TODO: need to use the rate service API
    return 1;
  }

  @Post() // /balance
  createAssets(
    @Headers('X-User-ID') userId: string,
    @Body() asstesInfo: { coin: string; amount: number },
  ) {
    return asstesInfo;
  }

  @Delete(':id') // /balance/:id
  removeAsset(@Headers('X-User-ID') userId: string, @Param('id') id: string) {
    return 'success';
  }
}
