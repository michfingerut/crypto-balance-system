import { Module } from '@nestjs/common';

import { SharedService } from './shared.service';
import { LoggingModule } from './logging/logging.module';
import { ErrorModule } from './error/error.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { FileOpModule } from './file-op/file-op.module';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [LoggingModule, ErrorModule, MiddlewareModule, FileOpModule],
})
export class SharedModule {}
