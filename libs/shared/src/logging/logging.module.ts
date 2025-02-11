import { Module } from '@nestjs/common';
import { CBSLogging } from './logging.controller';

@Module({
  providers: [CBSLogging],
  exports: [CBSLogging],
})
export class LoggingModule {}
