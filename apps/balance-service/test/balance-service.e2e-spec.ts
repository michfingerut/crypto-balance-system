import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { BalanceServiceModule } from '../src/balance-service.module';
import TestAgent from 'supertest/lib/agent';
import testUtils from './testUtils';

describe('BalanceServiceController (e2e)', () => {
  let app: INestApplication;
  let req: TestAgent;

  //codes
  const { OK } = testUtils.statusCode.SUCCESS;
  const { BAD_REQUEST, FORBIDDEN } = testUtils.statusCode.ERROR;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [BalanceServiceModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    req = request(app.getHttpServer());
  });

  describe('.GET /balance', () => {
    it('authorization', async () => {
      const res = await req.get('/balance');
      expect(res.statusCode).toBe(FORBIDDEN);
    });

    it('.GET validation', async () => {
      //not in uuid format
      const res = await req.get('/balance').set('X-User-ID', 'not valid uid');
      expect(res.statusCode).toBe(BAD_REQUEST);
    });

    it('basic .GET assets', () => {});
    it('.GET user with no assets', () => {});
    it('.GET on non existing userId', () => {});
  });

  describe('.GET /balance/total', () => {
    it('authorization', async () => {
      const res = await req.get('/balance/total');
      expect(res.statusCode).toBe(FORBIDDEN);
    });

    it('.GET /total validation', () => {});
    it('basic .GET /total', () => {});
    it('.GET /total on non existing userId', () => {});
  });

  describe('.POST /balance', () => {
    it('authorization', async () => {
      const res = await req.post('/balance').send({});
      expect(res.statusCode).toBe(FORBIDDEN);
    });

    it('.POST validation', () => {});
    it('basic .POST', () => {});
    it('.POST on non existing userId', () => {});
  });

  describe('.DELETE /balance', () => {
    it('authorization', async () => {
      const res = await req.delete('/balance/1');
      expect(res.statusCode).toBe(FORBIDDEN);
    });

    it('.DELETE validation', () => {});
    it('basic .DELETE', () => {});
    it('.DELETE on non existing asset', () => {});
  });
});
