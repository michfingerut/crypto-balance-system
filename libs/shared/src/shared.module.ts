import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggingModule } from './logging/logging.module';
import { ErrorModule } from './error/error.module';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [LoggingModule, ErrorModule],
})
export class SharedModule {}
