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
import { BalanceServiceService } from './balance-service.service';

@Controller('balance')
export class BalanceServiceController {
  constructor(private readonly balanceServiceService: BalanceServiceService) {}

  @Get() // /balance
  getAssetsOfUser(@Headers('X-User-ID') userId: string) {
    return [];
  }

  @Get('total') // /balance/total?coin=
  getCalculationOfTotalAssets(
    @Headers('X-User-ID') userId: string,
    @Query('coin') coin: 'USD' | 'EUR' | 'NIS',
  ) {
    return 1;
  }

  @Post() // /balance
  createAssets(@Headers('X-User-ID') userId: string, @Body() asstesInfo: {}) {
    return asstesInfo;
  }

  @Delete(':id') // /balance/:id
  removeAsset(@Headers('X-User-ID') userId: string, @Param('id') id: string) {
    return 'success';
  }
}
