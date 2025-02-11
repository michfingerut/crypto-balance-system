import { MiddlewareConsumer, Module } from '@nestjs/common';
import { RateServiceController } from './rate-service.controller';
import { RateServiceService } from './rate-service.service';
import { ValidateUserIdMiddleware } from '@app/shared/middleware/middleware.service';

@Module({
  imports: [],
  controllers: [RateServiceController],
  providers: [RateServiceService],
})
export class RateServiceModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ValidateUserIdMiddleware).forRoutes('*');
  }
}
