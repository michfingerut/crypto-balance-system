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
  const { BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = testUtils.statusCode.ERROR;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BalanceServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    req = request(app.getHttpServer());
  });

  describe('.POST /balance', () => {
    beforeEach(async () => {
      testUtils.clearFile();
    });

    it('authorization', async () => {
      const res = await req.post(route).send({});
      expect(res.statusCode).toBe(UNAUTHORIZED);

      const res2 = await req.post(route).send({}).set('X-User-ID', 'not uuid');
      expect(res2.statusCode).toBe(UNAUTHORIZED);
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
        { amount: -1, coin: 'bit coin' },

        //wrong parameters:
        //TODO: { amount: 2, coin: 'bit coin', michal: true },
      ];

      for (const body of invalidBody) {
        const res = await req.post(route).send(body).set('X-User-ID', userId);
        expect(res.statusCode).toBe(BAD_REQUEST);
      }
    });

    it('basic .POST', async () => {
      const toSend = {
        coin: 'bitcoin',
        amount: 2,
      };

      const res = await req.post(route).send(toSend).set('X-User-ID', userId);

      expect(res.body.id).toBeDefined();

      const expectedData = { ...toSend, userId: userId, id: res.body.id };
      testUtils.testResponse(res, CREATED, expectedData);
    });
  });

  describe('.GET /balance', () => {
    beforeEach(async () => {
      testUtils.clearFile();
    });

    it('authorization', async () => {
      const res = await req.get(route);
      expect(res.statusCode).toBe(UNAUTHORIZED);

      const res2 = await req.get(route).set('X-User-ID', 'not uuid');
      expect(res2.statusCode).toBe(UNAUTHORIZED);
    });

    it('basic .GET assets', async () => {
      const toSend = {
        coin: 'bitcoin',
        amount: 2,
      };

      const postRes = await req
        .post(route)
        .send(toSend)
        .set('X-User-ID', userId);

      const expectedData = { ...toSend, userId: userId, id: postRes.body.id };

      testUtils.testResponse(postRes, CREATED, expectedData);

      const getRes = await req.get(route).set('X-User-ID', userId);

      testUtils.testResponse(getRes, OK, [expectedData], 'id');
    });

    it('.GET user with no assets', async () => {
      const res = await req
        .get(route)
        .set('X-User-ID', testUtils.getRandomUuid());

      testUtils.testResponse(res, OK, []);
    });

    it('complex .GET', async () => {
      const expectedData: any = [];
      const user1ToSend = [
        {
          coin: 'bitcoin',
          amount: 2,
        },
        {
          coin: 'sol',
          amount: 0.5,
        },
      ];

      const user2ToSend = [
        {
          coin: 'bitcoin',
          amount: 0.5,
        },
        {
          coin: 'sol',
          amount: 0.5,
        },
      ];
      const user2UUID = testUtils.getRandomUuid();

      for (const body of user1ToSend) {
        const res = await req.post(route).send(body).set('X-User-ID', userId);
        expectedData.push(res.body);
      }

      for (const body of user2ToSend) {
        await req.post(route).send(body).set('X-User-ID', user2UUID);
      }

      const getRes = await req.get(route).set('X-User-ID', userId);
      testUtils.testResponse(getRes, OK, expectedData, 'id');
    });
  });

  describe.skip('.GET /balance/total', () => {
    //TODO after rate service will be implemented
    it('authorization', async () => {
      const res = await req.get(`${route}/total`);
      expect(res.statusCode).toBe(UNAUTHORIZED);

      const res2 = await req.get(`${route}/total`).set('X-User-ID', 'not uuid');
      expect(res2.statusCode).toBe(UNAUTHORIZED);
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
    beforeEach(async () => {
      testUtils.clearFile();
    });

    it('authorization', async () => {
      const res = await req.delete(`${route}/1`);
      expect(res.statusCode).toBe(UNAUTHORIZED);

      const res2 = await req.delete(`${route}/1`).set('X-User-ID', 'not uuid');
      expect(res2.statusCode).toBe(UNAUTHORIZED);
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
      const toSend = {
        coin: 'bitcoin',
        amount: 2,
      };

      const postRes = await req
        .post(route)
        .send(toSend)
        .set('X-User-ID', userId);

      const id = postRes.body?.id;
      const expectedData = { ...toSend, userId: userId, id: id };

      testUtils.testResponse(postRes, CREATED, expectedData);

      const deleteRes = await req
        .delete(`${route}/${id}`)
        .set('X-User-ID', userId);

      testUtils.testResponse(deleteRes, OK, expectedData);

      const getRes = await req.get(route).set('X-User-ID', userId);

      testUtils.testResponse(getRes, OK, []);
    });

    it('.DELETE on non existing asset', async () => {
      const deleteRes = await req
        .delete(`${route}/10`)
        .set('X-User-ID', userId);

      expect(deleteRes.statusCode).toBe(OK);
      testUtils.testResponse(deleteRes, OK, {});
    });

    it('.DELETE other user asset', async () => {
      const toSend = {
        coin: 'bitcoin',
        amount: 2,
      };

      const postRes = await req
        .post(route)
        .send(toSend)
        .set('X-User-ID', userId);

      const id = postRes.body?.id;
      const expectedData = { ...toSend, userId: userId, id: id };

      testUtils.testResponse(postRes, CREATED, expectedData);

      const deleteRes = await req
        .delete(`${route}/${id}`)
        .set('X-User-ID', testUtils.getRandomUuid());

      expect(deleteRes.statusCode).toBe(FORBIDDEN);
    });
  });
});
