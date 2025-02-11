import {
  BadRequestException,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
// import { CBSLogging } from '../logging/logging.controller';

@Controller('error')
export class CBSError {
  // private logger: CBSLogging;

  // constructor(logger: CBSLogging) {
  //   this.logger = logger;
  // }

  errHandler(message: string, code?: number) {
    //this.logger.error(message);
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
