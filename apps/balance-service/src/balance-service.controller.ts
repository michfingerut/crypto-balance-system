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
import { ValidationPipe } from '@nestjs/common';

//TODO: add loggings
@Controller('balance')
export class BalanceServiceController {
  constructor(private readonly balanceDataService: BalanceDataService) {}

  @Get()
  async getAssetsOfUser(@Headers('X-User-ID') userId: string) {
    const res = await this.balanceDataService.getAssets(userId);
    //Logger.log(`Get assets of ${userId}`);
    return res;
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

  @Post()
  async createAssets(
    @Headers('X-User-ID') userId: string,
    @Body(ValidationPipe) asstesInfo: CreateAssetDto,
  ) {
    const res = await this.balanceDataService.addAssets(userId, asstesInfo);

    //Logger.log(`${res.id} was created succssefuly`);

    return res;
  }

  @Delete(':id')
  async removeAsset(
    @Headers('X-User-ID') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const res = await this.balanceDataService.removeAssets(id, userId);
    //Logger.log(`${id} was deleted succssefuly`);

    return res;
  }
}
