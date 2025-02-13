import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

import { LoggingModule } from '@app/shared/logging/logging.module';
import { ValidateUserIdMiddleware } from '@app/shared/middleware/middleware.service';

import { RateServiceController } from './rate-service.controller';
import { RateService } from './rate-service.service';

@Module({
  imports: [
    LoggingModule,
    ScheduleModule.forRoot(),

    CacheModule.register({
      store: 'memory',
      ttl: 0, //prevent automatic exp, will be updated according to user demend
    }),
  ],
  controllers: [RateServiceController],
  providers: [RateService],
})
export class RateServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateUserIdMiddleware).forRoutes(RateServiceController);
  }
}
