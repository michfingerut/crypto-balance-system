import { Module } from '@nestjs/common';
import { BalanceServiceController } from './balance-service.controller';
import { BalanceDataService } from './balance-service.service';

@Module({
  imports: [],
  controllers: [BalanceServiceController],
  providers: [BalanceDataService],
})
export class BalanceServiceModule {}
