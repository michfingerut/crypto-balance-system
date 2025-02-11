import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BalanceServiceModule } from 'apps/balance-service/src/balance-service.module';
import { LoggingModule } from '@app/shared/logging/logging.module';
import { ErrorModule } from '@app/shared/error/error.module';
import { RateServiceModule } from 'apps/rate-service/src/rate-service.module';
import { MiddlewareModule } from '@app/shared/middleware/middleware.module';

@Module({
  imports: [
    BalanceServiceModule,
    LoggingModule,
    ErrorModule,
    RateServiceModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
