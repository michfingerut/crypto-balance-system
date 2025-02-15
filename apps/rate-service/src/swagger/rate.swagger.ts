import {
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';

const userIdExmp = '9069d931-7ff3-4ed6-b53a-5073e7cec346';

export function ApplyDecorators(
  decorators: MethodDecorator[],
): MethodDecorator {
  return (target, key, descriptor) => {
    decorators.forEach((decorator) => decorator(target, key, descriptor));
  };
}

export function GetRateDocs(): MethodDecorator {
  return ApplyDecorators([
    ApiOperation({ summary: 'Get rate between two coins' }),
    ApiQuery({
      name: 'coin',
      required: true,
      description: 'Coin to get the rate for',
      example: 'bitcoin',
    }),
    ApiQuery({
      name: 'vs_coin',
      required: true,
      description: 'Coin to convert to',
      example: 'usd',
    }),
    ApiHeader({
      name: 'X-User-ID',
      description: 'Unique identifier of the user',
      example: userIdExmp,
    }),
    ApiResponse({
      status: 200,
      description: 'Successfully fetched the rate',
      schema: {
        example: {
          bitcoin: {
            usd: 500000,
          },
        },
      },
    }),
    ApiResponse({
      status: 400,
      description: 'Validation error',
      schema: {
        example: {
          statusCode: 400,
          message: 'Validation error',
          error: 'Bad Request',
        },
      },
    }),
    ApiResponse({
      status: 401,
      description: 'X-User-ID missing',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid X-UserID Header',
          error: 'Unauthorized Error',
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: 'Coin not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Coin not found',
          error: 'Not Found Error',
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
        },
      },
    }),
  ]);
}

export function GetCoinListDocs(): MethodDecorator {
  return ApplyDecorators([
    ApiOperation({ summary: 'Get list of supported coins' }),
    ApiResponse({
      status: 200,
      description: 'Successfully fetched the coin list',
      schema: {
        example: [
          {
            name: 'bitcoin',
            symbol: 'bitcoin',
            id: 'bitcoin',
          },
        ],
      },
    }),
    ApiHeader({
      name: 'X-User-ID',
      description: 'Unique identifier of the user',
      example: userIdExmp,
    }),
    ApiResponse({
      status: 401,
      description: 'X-User-ID missing',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid X-UserID Header',
          error: 'Unauthorized Error',
        },
      },
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Internal server error',
          error: 'Internal Server Error',
        },
      },
    }),
  ]);
}
