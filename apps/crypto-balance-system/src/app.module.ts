import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalanceServiceModule } from 'apps/balance-service/src/balance-service.module';
import { LoggingModule } from '@app/shared/logging/logging.module';

@Module({
  imports: [BalanceServiceModule, LoggingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
