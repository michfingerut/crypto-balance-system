import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ValidateUserIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'];

    if (!userId || !isUUID(userId)) {
      throw new UnauthorizedException('Invalid or missing X-User-ID header');
    }

    next();
  }
}
