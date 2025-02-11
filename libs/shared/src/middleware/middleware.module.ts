import { Module } from '@nestjs/common';
import { ValidateUserIdMiddleware } from './middleware.service';
import { LoggingModule } from '../logging/logging.module';
import { ErrorModule } from '../error/error.module';

@Module({
  imports: [LoggingModule, ErrorModule],
  providers: [ValidateUserIdMiddleware],
  exports: [ValidateUserIdMiddleware],
})
export class MiddlewareModule {}
