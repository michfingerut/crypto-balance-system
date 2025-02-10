import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BalanceServiceModule } from '../src/balance-service.module';
import TestAgent from 'supertest/lib/agent';
import testUtils from './testUtils';

describe('BalanceServiceController (e2e)', () => {
  let app: INestApplication;
  let req: TestAgent;
  const route: string = '/balance';
  const userId = testUtils.getRandomUuid();

  //codes
  const { OK, CREATED } = testUtils.statusCode.SUCCESS;
  const { BAD_REQUEST, FORBIDDEN } = testUtils.statusCode.ERROR;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BalanceServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    req = request(app.getHttpServer());
  });

  describe('.POST /balance', () => {
    it('authorization', async () => {
      const res = await req.post(route).send({});
      expect(res.statusCode).toBe(FORBIDDEN);
    });

    it('.POST validation', async () => {
      const invalidBody = [
        undefined,
        {},
        //missing params
        { amount: 5 },
        { coin: 'bit coin' },
        //wrong types
        { amount: true, coin: 'bit coin' },
        //wrong parameters:
        { amount: 2, coin: 'bit coin', michal: true },
      ];

      await Promise.all(
        invalidBody.map(async (body) => {
          const res = await req.post(route).send(body).set('X-User-ID', userId);
          return expect(res.statusCode).toBe(BAD_REQUEST);
        }),
      );
    });

    it('basic .POST', async () => {
      const expectedData = {
        coin: 'bitcoin',
        amount: 2,
      };

      const res = await req
        .post(route)
        .send(expectedData)
        .set('X-User-ID', userId);

      expect(res.body.id).toBeDefined();

      testUtils.testResponse(res, CREATED, expectedData);
    });
  });

  describe('.GET /balance', () => {
    it('authorization', async () => {
      const res = await req.get(route);
      expect(res.statusCode).toBe(FORBIDDEN);
    });

    it('.GET validation', async () => {
      //not in uuid format
      const res = await req.get(route).set('X-User-ID', 'not valid uid');
      expect(res.statusCode).toBe(BAD_REQUEST);
    });

    it('basic .GET assets', async () => {
      const expectedData = {
        coin: 'bitcoin',
        amount: 2,
        id: 0,
      };

      const postRes = await req
        .post(route)
        .send({ coin: expectedData.coin, amount: expectedData.amount })
        .set('X-User-ID', userId);

      testUtils.testResponse(postRes, CREATED, expectedData);
      expectedData.id = postRes.body.id;

      const getRes = await req.get(route).set('X-User-ID', userId);
      testUtils.testResponse(getRes, OK, [expectedData]);
    });

    it('.GET user with no assets', async () => {
      const res = await req
        .get(route)
        .set('X-User-ID', testUtils.getRandomUuid());

      testUtils.testResponse(res, OK, []);
    });
  });

  describe('.GET /balance/total', () => {
    it('authorization', async () => {
      const res = await req.get(`${route}/total`);
      expect(res.statusCode).toBe(FORBIDDEN);
    });

    it('.GET /total validation', async () => {
      const invalidQuery = [
        {},
        //missing params
        { role: 'role' },
      ];

      await Promise.all(
        invalidQuery.map(async (query) => {
          const res = await req
            .get(`${route}/total`)
            .query(query)
            .set('X-User-ID', userId);
          return expect(res.statusCode).toBe(BAD_REQUEST);
        }),
      );
    });

    it('basic .GET /total', async () => {
      const expectedData = {
        coin: 'bitcoin',
        amount: 2,
        id: 0,
      };

      const postRes = await req
        .post(route)
        .send({ coin: expectedData.coin, amount: expectedData.amount })
        .set('X-User-ID', userId);

      testUtils.testResponse(postRes, CREATED, expectedData);

      const getRes = await req.get(`${route}/total`).set('X-User-ID', userId);

      expect(getRes.statusCode).toBe(OK);

      //TODO: testUtils.testResponse(getRes, OK, []);
    });

    it('.GET /total on non existing userId', async () => {
      const res = await req
        .get(`${route}/total`)
        .set('X-User-ID', testUtils.getRandomUuid());

      testUtils.testResponse(res, OK, []);
    });
  });

  describe('.DELETE /balance', () => {
    it('authorization', async () => {
      const res = await req.delete(`${route}/1`);
      expect(res.statusCode).toBe(FORBIDDEN);
    });

    it('.DELETE validation', async () => {
      const invalidIds = [{}, 'not valid id', true];

      await Promise.all(
        invalidIds.map(async (id) => {
          const res = await req
            .delete(`${route}/${id}`)
            .set('X-User-ID', userId);
          return expect(res.statusCode).toBe(BAD_REQUEST);
        }),
      );
    });

    it('basic .DELETE', async () => {
      const expectedData = {
        coin: 'bitcoin',
        amount: 2,
      };

      const postRes = await req
        .post(route)
        .send(expectedData)
        .set('X-User-ID', userId);

      testUtils.testResponse(postRes, CREATED, expectedData);
      const id = postRes.body.id;

      const deleteRes = await req
        .delete(`${route}/${id}`)
        .set('X-User-ID', userId);
      expect(deleteRes.statusCode).toBe(OK);
      //TODO: testUtils.testResponse(postRes, OK, {});

      const getRes = await req.get(route).set('X-User-ID', userId);

      testUtils.testResponse(getRes, OK, []);
    });

    it('.DELETE on non existing asset', async () => {
      const deleteRes = await req
        .delete(`${route}/10`)
        .set('X-User-ID', userId);
      expect(deleteRes.statusCode).toBe(OK);
      //TODO: testUtils.testResponse(postRes, OK, {});
    });
  });
});
