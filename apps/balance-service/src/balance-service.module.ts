import { MiddlewareConsumer, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { LoggingModule } from '@app/shared/logging/logging.module';
import { ErrorModule } from '@app/shared/error/error.module';
import { ValidateUserIdMiddleware } from '@app/shared/middleware/middleware.service';
import { FileOpModule } from '@app/shared/file-op/file-op.module';

import { BalanceServiceController } from './balance-service.controller';
import { BalanceDataService } from './balance-service.service';

@Module({
  imports: [
    LoggingModule,
    FileOpModule,
    ErrorModule,
    CacheModule.register({
      store: 'memory',
      ttl: 604800, //1 week
    }),
  ],
  controllers: [BalanceServiceController],
  providers: [BalanceDataService],
})
export class BalanceServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateUserIdMiddleware)
      .forRoutes(BalanceServiceController);
  }
}
