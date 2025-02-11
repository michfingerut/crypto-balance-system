import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { LoggingModule } from './logging/logging.module';

@Module({
  providers: [SharedService],
  exports: [SharedService],
  imports: [LoggingModule],
})
export class SharedModule {}
