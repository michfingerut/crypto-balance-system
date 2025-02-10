import { MiddlewareConsumer, Module } from '@nestjs/common';
import { BalanceServiceController } from './balance-service.controller';
import { BalanceDataService } from './balance-service.service';
import { ValidateUserIdMiddleware } from './middlewares/validate-user-id.middleware';

@Module({
  imports: [],
  controllers: [BalanceServiceController],
  providers: [BalanceDataService],
})
export class BalanceServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateUserIdMiddleware).forRoutes('*');
  }
}
