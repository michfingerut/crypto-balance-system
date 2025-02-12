import { HttpStatus, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { isUUID } from 'class-validator';
import { CBSLogging } from '../logging/logging.service';

@Injectable()
export class ValidateUserIdMiddleware implements NestMiddleware {
  constructor(@Inject(CBSLogging) private readonly logger: CBSLogging) {}

  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];

    if (!userId || !isUUID(userId)) {
      const message = 'Invalid or missing X-User-ID header';

      //cant use CBSError becuase The CBSError filter is only catching exceptions thrown in controllers or services, not middleware.
      this.logger.error(` ${HttpStatus.UNAUTHORIZED} : ${message}`);

      res.status(HttpStatus.UNAUTHORIZED).json({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: message,
      });
      return;
    }

    next();
  }
}
