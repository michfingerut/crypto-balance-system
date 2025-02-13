import { Module } from '@nestjs/common';

import { CBSFileOpService } from './file-op.service';

@Module({
  providers: [CBSFileOpService],
  exports: [CBSFileOpService],
})
export class FileOpModule {}
