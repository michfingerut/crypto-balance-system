import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Headers,
  ParseIntPipe,
} from '@nestjs/common';
import { BalanceDataService } from './balance-service.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UsePipes, ValidationPipe } from '@nestjs/common';

//TODO: add loggings
@Controller('balance')
export class BalanceServiceController {
  constructor(private readonly balanceDataService: BalanceDataService) {}

  @Get()
  async getAssetsOfUser(@Headers('X-User-ID') userId: string) {
    return await this.balanceDataService.getAssets(userId);
  }

  @Get('total') // /balance/total?coin=
  async getCalculationOfTotalAssets(
    @Headers('X-User-ID') userId: string,
    @Query('coin') coin: 'USD' | 'EUR' | 'NIS',
  ) {
    //TODO: need to use the rate service API
    //TODO: validation
    return 1;
  }

  @Post() // /balance
  @UsePipes(new ValidationPipe({ transform: true }))
  async createAssets(
    @Headers('X-User-ID') userId: string,
    @Body() asstesInfo: CreateAssetDto,
  ) {
    const res = await this.balanceDataService.addAssets(userId, asstesInfo);
    return res;
  }

  @Delete(':id')
  async removeAsset(
    @Headers('X-User-ID') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.balanceDataService.removeAssets(id, userId);
  }
}
