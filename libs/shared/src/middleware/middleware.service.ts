import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'class-validator';
import { CBSLogging } from '@app/shared/logging/logging.controller';
import { CBSError } from '@app/shared/error/error.controller';

//TODO: move to utils
@Injectable()
export class ValidateUserIdMiddleware implements NestMiddleware {
  private readonly logger = new CBSLogging(ValidateUserIdMiddleware.name);
  private readonly errCo = new CBSError();

  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];

    if (!userId || !isUUID(userId)) {
      const message = 'Invalid or missing X-User-ID header';

      this.logger.error(message);
      this.errCo.errHandler(message, HttpStatus.UNAUTHORIZED);
    }

    next();
  }
}
