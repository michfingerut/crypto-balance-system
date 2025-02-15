import * as path from 'path';
import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';

import {
  clearFile,
  getRandomUuid,
  statusCode,
  testResponse,
} from './testUtils/index';

describe('BalanceServiceController (e2e)', () => {
  let req: TestAgent= request('http://localhost:3001');;
  const route: string = '/balance';
  const userId = getRandomUuid();
  const dataFilePath = path.join(__dirname, '..', './dist/data', 'balanceData.json');

  //codes
  const { OK, CREATED } = statusCode.SUCCESS;
  const { BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } = statusCode.ERROR;

  describe('.POST /balance', () => {
    beforeEach(async () => {
      clearFile(dataFilePath);
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
        //not valid values
        { amount: true, coin: 'bit coin' },
        { amount: -1, coin: 'bit coin' },
        { amount: 2, coin: '' },
        { amount: 5, coin: 'not exist coin' },

        //wrong parameters:
        //TODO:{ amount: 2, coin: 'bit coin', michal: true },
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
      testResponse(res, CREATED, expectedData);
    });
  });

  describe('.GET /balance', () => {
    beforeEach(async () => {
      clearFile(dataFilePath);
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

      testResponse(postRes, CREATED, expectedData);

      const getRes = await req.get(route).set('X-User-ID', userId);

      testResponse(getRes, OK, [expectedData], 'id');
    });

    it('.GET user with no assets', async () => {
      const res = await req.get(route).set('X-User-ID', getRandomUuid());

      testResponse(res, OK, []);
    });

    it('complex .GET', async () => {
      const expectedData: any = [];
      const user1ToSend = [
        {
          coin: 'bitcoin',
          amount: 2,
        },
        {
          coin: 'Zus',
          amount: 0.5,
        },
      ];

      const user2ToSend = [
        {
          coin: 'bitcoin',
          amount: 0.5,
        },
        {
          coin: 'Zus',
          amount: 0.5,
        },
      ];
      const user2UUID = getRandomUuid();

      for (const body of user1ToSend) {
        const res = await req.post(route).send(body).set('X-User-ID', userId);
        expectedData.push(res.body);
      }

      for (const body of user2ToSend) {
        await req.post(route).send(body).set('X-User-ID', user2UUID);
      }

      const getRes = await req.get(route).set('X-User-ID', userId);
      testResponse(getRes, OK, expectedData, 'id');
    });
  });

  describe('.GET /balance/total', () => {
    beforeEach(async () => {
      clearFile(dataFilePath);
    });

    it('authorization', async () => {
      const res = await req.get(`${route}/total`);
      expect(res.statusCode).toBe(UNAUTHORIZED);

      const res2 = await req.get(`${route}/total`).set('X-User-ID', 'not uuid');
      expect(res2.statusCode).toBe(UNAUTHORIZED);
    });

    it('.GET /total validation', async () => {
      const invalidQuery = [
        {},
        //wrong param
        { role: 'role' },
        //empty string
        { coin: '' },
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
      const toSend = {
        coin: 'bitcoin',
        amount: 2,
      };

      const postRes = await req
        .post(route)
        .send(toSend)
        .set('X-User-ID', userId);

      const expectedData = { ...toSend, userId: userId, id: postRes.body.id };
      testResponse(postRes, CREATED, expectedData);

      const getRes = await req
        .get(`${route}/total`)
        .query({ coin: 'usd' })
        .set('X-User-ID', userId);

      expect(getRes.statusCode).toBe(OK);
      expect(getRes.body.value).toBeDefined();
    });

    it('.GET /total not existing coin', async () => {
      const toSend = {
        coin: 'bitcoin',
        amount: 2,
      };

      const postRes = await req
        .post(route)
        .send(toSend)
        .set('X-User-ID', userId);

      const expectedData = { ...toSend, userId: userId, id: postRes.body.id };
      testResponse(postRes, CREATED, expectedData);

      const getRes = await req
        .get(`${route}/total`)
        .query({ coin: 'michal' })
        .set('X-User-ID', userId);

      expect(getRes.statusCode).toBe(BAD_REQUEST);
    });

    it('.GET /total with no assets', async () => {
      const res = await req
        .get(`${route}/total`)
        .query({ coin: 'usd' })
        .set('X-User-ID', getRandomUuid());

      testResponse(res, OK, { value: 0 });
    });
  });

  describe('.DELETE /balance', () => {
    beforeEach(async () => {
      clearFile(dataFilePath);
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

      testResponse(postRes, CREATED, expectedData);

      const deleteRes = await req
        .delete(`${route}/${id}`)
        .set('X-User-ID', userId);

      testResponse(deleteRes, OK, expectedData);

      const getRes = await req.get(route).set('X-User-ID', userId);

      testResponse(getRes, OK, []);
    });

    it('.DELETE on non existing asset', async () => {
      const deleteRes = await req
        .delete(`${route}/10`)
        .set('X-User-ID', userId);

      expect(deleteRes.statusCode).toBe(OK);
      testResponse(deleteRes, OK, {});
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

      testResponse(postRes, CREATED, expectedData);

      const deleteRes = await req
        .delete(`${route}/${id}`)
        .set('X-User-ID', getRandomUuid());

      expect(deleteRes.statusCode).toBe(FORBIDDEN);
    });
  });
});
