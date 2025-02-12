import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CBSLogging extends ConsoleLogger {
  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
  }

  log(message: any, context?: string) {
    super.log(message, context);
  }
}
