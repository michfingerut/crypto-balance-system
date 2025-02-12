import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
  HttpStatus,
  NotFoundException,
  Injectable,
} from '@nestjs/common';

import { CBSLogging } from '../logging/logging.service';

@Injectable()
export class CBSError {
  private logger: CBSLogging;

  constructor(logger: CBSLogging) {
    this.logger = logger;
  }

  errHandler(message: string, code?: number) {
    this.logger.error(` ${code} : ${message}`);
    switch (code) {
      case HttpStatus.BAD_REQUEST:
        throw new BadRequestException(message);
      case HttpStatus.UNAUTHORIZED:
        throw new UnauthorizedException(message);
      case HttpStatus.FORBIDDEN:
        throw new ForbiddenException(message);
      case HttpStatus.NOT_FOUND:
        throw new NotFoundException(message);
      default:
        throw new InternalServerErrorException('internal error');
    }
  }
}
