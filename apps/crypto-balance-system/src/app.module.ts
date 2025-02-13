import { Module } from '@nestjs/common';

import { BalanceServiceModule } from 'apps/balance-service/src/balance-service.module';
import { LoggingModule } from '@app/shared/logging/logging.module';
import { ErrorModule } from '@app/shared/error/error.module';
import { RateServiceModule } from 'apps/rate-service/src/rate-service.module';
import { MiddlewareModule } from '@app/shared/middleware/middleware.module';
import { FileOpModule } from '@app/shared/file-op/file-op.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    BalanceServiceModule,
    LoggingModule,
    ErrorModule,
    FileOpModule,
    RateServiceModule,
    MiddlewareModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
