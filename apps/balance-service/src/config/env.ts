import * as dotenv from 'dotenv';

import { BalanceEnv } from '../utils';

class EnvClass {
  private static instance: EnvClass;
  private env: BalanceEnv;

  private constructor() {
    dotenv.config({ path: './apps/balance-service/.env' });

    this.env = {
      serverPort: parseInt(process.env.SERVER_PORT || '3001'),
      rateServerUrl: process.env.RATE_SERVER_URL as string,
    };
  }

  static getInstance(): EnvClass {
    if (!EnvClass.instance) {
      EnvClass.instance = new EnvClass();
    }
    return EnvClass.instance;
  }

  get(key: 'serverPort' | 'rateServerUrl'): string | number {
    return this.env[key];
  }
}

export { EnvClass };
