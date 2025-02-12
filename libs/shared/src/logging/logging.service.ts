import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CBSLogging extends ConsoleLogger {
  error(message: string, stack?: string, context?: string) {
    super.error(message, stack, context);
  }

  log(message: string, context?: string) {
    super.log(message, context);
  }
}
