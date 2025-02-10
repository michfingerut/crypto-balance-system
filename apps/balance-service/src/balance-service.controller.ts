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
import { CreateAssetDto, IdDto } from './dto/validators.dto';
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
  @UsePipes(new ValidationPipe({ transform: true }))
  async removeAsset(
    @Headers('X-User-ID') userId: string,
    @Param('id') id: IdDto,
  ) {
    return await this.balanceDataService.removeAssets(+id);
  }
}
