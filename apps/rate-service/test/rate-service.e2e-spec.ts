import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RateServiceModule } from '../src/rate-service.module';
import testUtils from './testUtils';
import TestAgent from 'supertest/lib/agent';

describe('RateServiceController (e2e)', () => {
  let app: INestApplication;
  let req: TestAgent;
  const route: string = '/rate';
  const userId = testUtils.getRandomUuid();

  //codes
  const { OK, CREATED } = testUtils.statusCode.SUCCESS;
  const { BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = testUtils.statusCode.ERROR;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RateServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    req = request(app.getHttpServer());
  });

  it('authorization', async () => {
    const res = await req.get(route);
    expect(res.statusCode).toBe(UNAUTHORIZED);

    const res2 = await req.get(route).set('X-User-ID', 'not uuid');
    expect(res2.statusCode).toBe(UNAUTHORIZED);
  });

  it('validation', async () => {
    const invalidQuery = [
      {},
      //wrong params
      { role: 'role' },
      //wrong type
      { coin: 'role' },
    ];

    await Promise.all(
      invalidQuery.map(async (query) => {
        const res = await req
          .get(`${route}`)
          .query(query)
          .set('X-User-ID', userId);
        return expect(res.statusCode).toBe(BAD_REQUEST);
      }),
    );
  });

  it('basic .GET rate', async () => {
    const getRes = await req
      .get(`${route}`)
      .query({ coin: 'bitcoin' })
      .set('X-User-ID', userId);

    expect(getRes.statusCode).toBe(OK);
    expect(getRes.body.calc).toBeDefined();
  });
});
