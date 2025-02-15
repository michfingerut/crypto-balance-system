import {
  ApiResponse,
  ApiOperation,
  ApiQuery,
  ApiBody,
  ApiParam,
  ApiHeader,
} from '@nestjs/swagger';

import { CreateAssetDto } from '../dto/create-asset.dto';

const userIdExmp = '9069d931-7ff3-4ed6-b53a-5073e7cec346';
const assetSchemaExmp = {
  coin: 'bitcoin',
  amount: 2.5,
  userId: userIdExmp,
  id: 1,
};

export const GetAssetsOfUserDocs = {
  operation: ApiOperation({ summary: 'Get assets of a user' }),
  headers: ApiHeader({
    name: 'X-User-ID',
    description: 'Unique identifier of the user',
    example: userIdExmp,
  }),
  response: ApiResponse({
    status: 200,
    description: 'Successfully retrieved assets of the user',
    schema: {
      example: assetSchemaExmp,
    },
  }),
};

export const GetCalculationOfTotalAssetsDocs = {
  operation: ApiOperation({ summary: 'Get total calculation of user assets' }),
  query: ApiQuery({
    name: 'coin',
    required: false,
    description: 'Coin type to calculate',
    schema: {
      example: 'usd',
    },
  }),
  headers: ApiHeader({
    name: 'X-User-ID',
    description: 'Unique identifier of the user',
    example: userIdExmp,
  }),
  response: ApiResponse({
    status: 200,
    description: 'Successfully retrieved total assets calculation',
    schema: {
      example: { value: 2034 },
    },
  }),
  validationError: ApiResponse({
    status: 400,
    description: 'Validation error',
  }),
  unauthorized: ApiResponse({
    status: 401,
    description: 'Invalid X-UserID Header',
  }),
  coinNotFound: ApiResponse({ status: 404, description: 'Coin not found' }),
  internalError: ApiResponse({
    status: 500,
    description: 'Internal server error',
  }),
};

export const CreateAssetsDocs = {
  operation: ApiOperation({ summary: 'Create new assets for a user' }),
  headers: ApiHeader({
    name: 'X-User-ID',
    description: 'Unique identifier of the user',
    example: userIdExmp,
  }),
  body: ApiBody({
    type: CreateAssetDto,
    description: 'Asset creation payload',
    schema: {
      example: { coin: 'bitcoin', amount: 2.5 },
    },
  }),
  response: ApiResponse({
    status: 201,
    description: 'Successfully created assets for the user',
    schema: {
      example: assetSchemaExmp,
    },
  }),
  validationError: ApiResponse({
    status: 400,
    description: 'Validation error',
  }),
  unauthorized: ApiResponse({
    status: 401,
    description: 'Invalid X-UserID Header',
  }),
  internalError: ApiResponse({
    status: 500,
    description: 'Internal server error',
  }),
};

export const RemoveAssetDocs = {
  operation: ApiOperation({ summary: 'Remove an asset from the user' }),
  headers: ApiHeader({
    name: 'X-User-ID',
    description: 'Unique identifier of the user',
    example: userIdExmp,
  }),
  param: ApiParam({
    name: 'id',
    description: 'ID of the asset to be removed',
    schema: { example: 2 },
  }),
  response: ApiResponse({
    status: 200,
    description: 'Successfully removed the asset',
    schema: { example: assetSchemaExmp },
  }),
  validationError: ApiResponse({
    status: 400,
    description: 'Validation error',
  }),
  unauthorized: ApiResponse({
    status: 401,
    description: 'Invalid X-UserID Header',
  }),
  internalError: ApiResponse({
    status: 500,
    description: 'Internal server error',
  }),
};
