import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class CBSLogging extends ConsoleLogger {
  error(message: string, stack?: string, context = 'CBS') {
    super.error(message, stack, context);
  }

  log(message: string, context = 'CBS') {
    super.log(message, context);
  }
}
