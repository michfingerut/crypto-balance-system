import { Module } from '@nestjs/common';
import { ValidateUserIdMiddleware } from './middleware.service';

@Module({
  providers: [ValidateUserIdMiddleware],
  exports: [ValidateUserIdMiddleware],
})
export class MiddlewareModule {}
