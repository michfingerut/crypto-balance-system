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
import { CBSLogging } from '@app/shared/logging/logging.controller';

@Controller('balance')
export class BalanceServiceController {
  private logger = new CBSLogging(BalanceServiceController.name);
  constructor(private readonly balanceDataService: BalanceDataService) {}

  @Get()
  async getAssetsOfUser(@Headers('X-User-ID') userId: string) {
    const res = await this.balanceDataService.getAssets(userId);
    this.logger.log(`Get assets of ${userId}`);
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
    //TODO: need to validate that the coin is a real coin name
    const res = await this.balanceDataService.addAssets(userId, asstesInfo);

    this.logger.log(`${res.id} was created succssefuly`);

    return res;
  }

  @Delete(':id')
  async removeAsset(
    @Headers('X-User-ID') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const res = await this.balanceDataService.removeAssets(id, userId);
    this.logger.log(`${id} was deleted succssefuly`);

    return res;
  }
}
