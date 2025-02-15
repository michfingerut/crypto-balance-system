import * as request from 'supertest';
import TestAgent from 'supertest/lib/agent';
import axios from 'axios';

import { getRandomUuid, statusCode } from '../testUtils/index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RateServiceController (e2e)', () => {
  let req: TestAgent= request('http://localhost:3002');
  const route: string = '/rate';
  const userId = getRandomUuid();

  // Status codes
  const { OK } = statusCode.SUCCESS;
  const { BAD_REQUEST, UNAUTHORIZED, NOT_FOUND } = statusCode.ERROR;

  afterEach(() => {
    mockedAxios.get.mockClear();
  });

  it('authorization', async () => {
    const res = await req.get(route);
    expect(res.statusCode).toBe(UNAUTHORIZED);

    const res2 = await req.get(route).set('X-User-ID', 'not uuid');
    expect(res2.statusCode).toBe(UNAUTHORIZED);
  });

  it('validation', async () => {
    const invalidQuery = [{}, { role: 'role' }, { coin: '' }];

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

  //TODO: mock doesnt work
  it.skip('basic .GET rate', async () => {
    const coin = 'bitcoin';
    const mockCoinList = [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' }];
    const mockRateResponse = { bitcoin: { usd: 50000 } };

    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinList });
    mockedAxios.get.mockResolvedValueOnce({ data: mockRateResponse });

    const getRes = await req
      .get(`${route}`)
      .query({ coin: coin, vs_coin: 'usd' })
      .set('X-User-ID', userId);

    expect(getRes.statusCode).toBe(OK);
    expect(getRes.body[coin]?.usd).toBe(mockRateResponse.bitcoin.usd);
  });

  it('.GET on non-existing coin', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' }],
    });

    const getRes1 = await req
      .get(`${route}`)
      .query({ coin: 'bitcoin', vs_coin: 'michal' })
      .set('X-User-ID', userId);
    expect(getRes1.statusCode).toBe(NOT_FOUND);

    const getRes2 = await req
      .get(`${route}`)
      .query({ coin: 'michal', vs_coin: 'usd' })
      .set('X-User-ID', userId);
    expect(getRes2.statusCode).toBe(NOT_FOUND);
  });

  //TODO: mock doesnt work
  it.skip('basic .GET coin list', async () => {
    const mockCoinList = [{ id: 'bitcoin', name: 'Bitcoin', symbol: 'btc' }];

    mockedAxios.get.mockResolvedValueOnce({ data: mockCoinList });

    const getResExist = await req
      .get(`${route}/coin-list`)
      .set('X-User-ID', userId);

    expect(getResExist.statusCode).toBe(OK);
    expect(Array.isArray(getResExist.body)).toBe(true);
    expect(getResExist.body.length).toBeGreaterThan(0);
    expect(getResExist.body[0].id).toBe(mockCoinList[0].id);
  });
});
