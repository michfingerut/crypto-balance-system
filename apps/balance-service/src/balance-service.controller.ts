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
  UseFilters,
} from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { BalanceDataService } from './balance-service.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { GetCalcDto } from './dto/get-calculation.dto';
import { CBSError } from '@app/shared/error/error.service';

@Controller('balance')
@UseFilters(CBSError)
export class BalanceServiceController {
  constructor(
    private readonly balanceDataService: BalanceDataService,
    private readonly logger: CBSLogging,
  ) {
    this.logger.setContext(BalanceDataService.name);
  }

  @Get()
  async getAssetsOfUser(@Headers('X-User-ID') userId: string) {
    const res = await this.balanceDataService.getAssets(userId);
    this.logger.log(`Get assets of ${userId}`);
    return res;
  }

  @Get('total') // /balance/total?coin=
  async getCalculationOfTotalAssets(
    @Headers('X-User-ID') userId: string,
    @Query(ValidationPipe) query: GetCalcDto,
  ) {
    const { coin } = query;
    const res = await this.balanceDataService.getCalculation(userId, coin);

    this.logger.log(`Get calculation of ${userId} assets`);

    return res;
  }

  @Post()
  async createAssets(
    @Headers('X-User-ID') userId: string,
    @Body(ValidationPipe) asstesInfo: CreateAssetDto,
  ) {
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
