import { Module } from '@nestjs/common';

import { CBSLogging } from './logging.service';

@Module({
  providers: [CBSLogging],
  exports: [CBSLogging],
})
export class LoggingModule {}
