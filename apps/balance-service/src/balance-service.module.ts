import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BalanceServiceController } from './balance-service.controller';
import { BalanceDataService } from './balance-service.service';
import { ValidateUserIdMiddleware } from './middlewares/validate-user-id.middleware';
import { LoggingModule } from '@app/shared/logging/logging.module';

@Module({
  imports: [LoggingModule],
  controllers: [BalanceServiceController],
  providers: [BalanceDataService],
})
export class BalanceServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateUserIdMiddleware).forRoutes('*');
  }
}
