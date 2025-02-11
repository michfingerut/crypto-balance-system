import { Injectable, NestMiddleware, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'class-validator';
import { CBSLogging } from '@app/shared/logging/logging.service';
import { CBSError } from '@app/shared/error/error.service';

@Injectable()
export class ValidateUserIdMiddleware implements NestMiddleware {
  private readonly errCo = new CBSError(
    new CBSLogging(ValidateUserIdMiddleware.name),
  );

  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];

    if (!userId || !isUUID(userId)) {
      this.errCo.errHandler(
        'Invalid or missing X-User-ID header',
        HttpStatus.UNAUTHORIZED,
      );
    }

    next();
  }
}
