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
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CBSLogging } from '@app/shared/logging/logging.service';
import { CBSError } from '@app/shared/error/error.service';

import { BalanceDataService } from './balance-service.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { GetCalcDto } from './dto/get-calculation.dto';
import {
  GetAssetsOfUserDocs,
  GetCalculationOfTotalAssetsDocs,
  CreateAssetsDocs,
  RemoveAssetDocs,
} from './swagger/balance.swagger';

@Controller('balance')
@UseFilters(CBSError)
@ApiTags('Balance')
export class BalanceServiceController {
  constructor(
    private readonly balanceDataService: BalanceDataService,
    private readonly logger: CBSLogging,
  ) {}

  @Get()
  @GetAssetsOfUserDocs.operation
  @GetAssetsOfUserDocs.response
  @GetCalculationOfTotalAssetsDocs.validationError
  @GetCalculationOfTotalAssetsDocs.unauthorized
  @GetCalculationOfTotalAssetsDocs.internalError
  async getAssetsOfUser(@Headers('X-User-ID') userId: string) {
    const res = await this.balanceDataService.getAssets(userId);
    this.logger.log(`Get assets of ${userId}`);
    return res;
  }

  @Get('total')
  @GetCalculationOfTotalAssetsDocs.operation
  @GetCalculationOfTotalAssetsDocs.query
  @GetCalculationOfTotalAssetsDocs.response
  @GetCalculationOfTotalAssetsDocs.validationError
  @GetCalculationOfTotalAssetsDocs.unauthorized
  @GetCalculationOfTotalAssetsDocs.coinNotFound
  @GetCalculationOfTotalAssetsDocs.internalError
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
  @CreateAssetsDocs.operation
  @CreateAssetsDocs.body
  @CreateAssetsDocs.response
  @CreateAssetsDocs.validationError
  @CreateAssetsDocs.unauthorized
  @CreateAssetsDocs.internalError
  async createAssets(
    @Headers('X-User-ID') userId: string,
    @Body(ValidationPipe) asstesInfo: CreateAssetDto,
  ) {
    const res = await this.balanceDataService.addAssets(userId, asstesInfo);
    this.logger.log(`${res.id} was created successfully`);
    return res;
  }

  @Delete(':id')
  @RemoveAssetDocs.operation
  @RemoveAssetDocs.param
  @RemoveAssetDocs.response
  @RemoveAssetDocs.validationError
  @RemoveAssetDocs.unauthorized
  @RemoveAssetDocs.internalError
  async removeAsset(
    @Headers('X-User-ID') userId: string,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const res = await this.balanceDataService.removeAssets(id, userId);
    this.logger.log(`${id} was deleted successfully`);
    return res;
  }
}
