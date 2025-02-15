import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';

import { getRandomUuid, statusCode } from '../testUtils/index';

// jest.mock('@app/shared/logging/logging.service', () => {
//   return {
//     CBSLogging: jest.fn().mockImplementation(() => ({
//       log: jest.fn(),
//       error: jest.fn(),
//       warn: jest.fn(),
//       debug: jest.fn(),
//       verbose: jest.fn(),
//       setContext: jest.fn(),
//     })),
//   };
// });

describe('RateServiceController (e2e)', () => {
  let app: INestApplication;
  let req: TestAgent;
  const route: string = '/rate';
  const userId = getRandomUuid();

  //codes
  const { OK } = statusCode.SUCCESS;

  beforeEach(async () => {
    // const moduleFixture: TestingModule = await Test.createTestingModule({
    //   imports: [RateServiceModule],
    // }).compile();

    // app = moduleFixture.createNestApplication();
    // await app.init();
    req = request('http://localhost:3002');
  });

  it('basic e2e .GET rate', async () => {
    const coin = 'bitcoin';
    const getRes = await req
      .get(`${route}`)
      .query({ coin: coin, vs_coin: 'usd' })
      .set('X-User-ID', userId);

    expect(getRes.statusCode).toBe(OK);
    expect(getRes.body[coin]).toBeDefined();
  });

  it('basic .GET coin list', async () => {
    const getResExist = await req
      .get(`${route}/coin-list`)
      .set('X-User-ID', userId);

    expect(getResExist.statusCode).toBe(OK);
    expect(Array.isArray(getResExist.body)).toBe(true);
    expect(getResExist.body.length).toBeGreaterThan(0);
  });
});
