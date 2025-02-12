import { Module } from '@nestjs/common';

import { SharedService } from './shared.service';
import { LoggingModule } from './logging/logging.module';
import { ErrorModule } from './error/error.module';
import { MiddlewareModule } from './middleware/middleware.module';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [LoggingModule, ErrorModule, MiddlewareModule],
})
export class SharedModule {}
