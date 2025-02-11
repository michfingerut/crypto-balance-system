import { Module } from '@nestjs/common';
import { CBSLogging } from './logging.controller';

@Module({
  controllers: [CBSLogging],
})
export class LoggingModule {}
