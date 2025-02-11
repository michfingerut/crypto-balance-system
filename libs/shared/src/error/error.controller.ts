import {
  BadRequestException,
  Controller,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
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
      case 400:
        throw new BadRequestException(message);
      case 401:
        throw new UnauthorizedException(message);
      case 403:
        throw new ForbiddenException(message);
      default:
        throw new InternalServerErrorException('internal error');
    }
  }
}
