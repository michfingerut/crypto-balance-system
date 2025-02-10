import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

const statusCode = {
  SUCCESS: { OK: 20, CREATED: 201 },
  ERROR: { BAD_REQUEST: 400, UNAUTHORIZED: 401, FORBIDDEN: 403 },
};

const getRandomUuid = () => {
  return uuidv4();
};

//TODO
const compareData = (recivedData: any, expectedData: any) => {
  return Object.keys(expectedData).forEach((key) => {
    expect(recivedData[key]).toEqual(expectedData[key]);
  });
};

const testResponse = (
  res: any, //TODO
  expectedStatus: number,
  expectedRes: any, //TODO
  sortByProp?: string,
) => {
  expect(res.statusCode).toBe(expectedStatus);
  expect(res.body.length).toBe(expectedRes.length);

  if (res.body.length > 0) {
    const sortedRes = _.sortBy(res.body, sortByProp);
    expectedRes = _.sortBy(expectedRes, sortByProp);

    for (let i = 0; i < expectedRes.length; ++i) {
      compareData(sortedRes[i], expectedRes[i]);
    }
  } else {
    compareData(res.body, expectedRes);
  }
};

export default {
  statusCode,
  getRandomUuid,
  compareData,
  testResponse,
};
