import {
  Controller,
  Get,
  Query,
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { CBSLogging } from '@app/shared/logging/logging.service';
import { CBSError } from '@app/shared/error/error.service';

import { RateService } from './rate-service.service';
import { GetRateDTO } from './dto/get-rate.dto';

@Controller('rate')
@UseFilters(CBSError)
@ApiTags('Rate')
export class RateServiceController {
  constructor(
    private readonly rateService: RateService,
    private readonly logger: CBSLogging,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get rate between two coins' })
  @ApiQuery({
    name: 'coin',
    required: true,
    description: 'Coin to get the rate for',
    example: 'bitcoin',
  })
  @ApiQuery({
    name: 'vs_coin',
    required: true,
    description: 'Coin to convert to',
    example: 'usd',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the rate',
    schema: {
      example: {
        bitcoin: {
          usd: 500000,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'X-User-ID missing',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Coin not found',
    schema: {
      example: {
        statusCode: 404,
        message: 'Coin not found',
        error: 'Not Found',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  async getRate(@Query(ValidationPipe) query: GetRateDTO) {
    const { coin, vs_coin } = query;
    const res = await this.rateService.getRate(coin, vs_coin);
    this.logger.log(`get rate ${coin}-${vs_coin}`);
    return res;
  }

  @Get('/coin-list')
  @ApiOperation({ summary: 'Get list of supported coins' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched the coin list',
    schema: {
      example: [
        {
          name: 'bitcoin',
          symbol: '',
          id: 'bitcoin',
        },
      ],
    },
  })
  @ApiResponse({
    status: 401,
    description: 'X-User-ID missing',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal server error',
        error: 'Internal Server Error',
      },
    },
  })
  async getCoinList() {
    const res = await this.rateService.getCoinList();
    this.logger.log(`get coin list`);
    return res;
  }
}
