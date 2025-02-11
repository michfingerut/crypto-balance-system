import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RateServiceController } from './rate-service.controller';
import { RateService } from './rate-service.service';
import { ValidateUserIdMiddleware } from '@app/shared/middleware/middleware.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CacheModule.register({
      store: 'memory',
      ttl: 600,
    }),
  ],
  controllers: [RateServiceController],
  providers: [RateService],
})
export class RateServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateUserIdMiddleware).forRoutes('*');
  }
}
