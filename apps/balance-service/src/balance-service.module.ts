import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BalanceServiceController } from './balance-service.controller';
import { BalanceDataService } from './balance-service.service';
import { LoggingModule } from '@app/shared/logging/logging.module';
import { ErrorModule } from '@app/shared/error/error.module';
import { ValidateUserIdMiddleware } from '@app/shared/middleware/middleware.service';

@Module({
  imports: [LoggingModule, ErrorModule],
  controllers: [BalanceServiceController],
  providers: [BalanceDataService],
})
export class BalanceServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateUserIdMiddleware).forRoutes('*');
  }
}
