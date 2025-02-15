import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';

import { getRandomUuid, statusCode } from '../testUtils/index';


describe('RateServiceController (e2e)', () => {
  let req: TestAgent = request('http://localhost:3002');
  const route: string = '/rate';
  const userId = getRandomUuid();

  //codes
  const { OK } = statusCode.SUCCESS;

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
