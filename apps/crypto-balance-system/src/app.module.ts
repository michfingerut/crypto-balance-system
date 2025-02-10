import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalanceServiceModule } from 'apps/balance-service/src/balance-service.module';

@Module({
  imports: [BalanceServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
