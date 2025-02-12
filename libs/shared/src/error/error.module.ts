import { Module } from '@nestjs/common';

import { CBSError } from './error.service';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [LoggingModule],
  providers: [CBSError],
  exports: [CBSError],
})
export class ErrorModule {}
