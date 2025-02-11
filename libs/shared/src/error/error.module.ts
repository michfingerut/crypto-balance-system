import { Module } from '@nestjs/common';
import { CBSError } from './error.controller';

@Module({
  controllers: [CBSError],
})
export class ErrorModule {}
