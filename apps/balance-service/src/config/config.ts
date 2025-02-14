import * as dotenv from 'dotenv';

import { BalanceEnv } from '../utils/types';

class ConfigUtils {
  private static instance: ConfigUtils;
  private env: BalanceEnv;

  private constructor() {
    dotenv.config({ path: './apps/balance-service/.env' });

    this.env = {
      serverPort: parseInt(process.env.SERVER_PORT || '3001'),
      rateServerUrl: process.env.RATE_SERVER_URL as string,
    };
  }

  static getInstance(): ConfigUtils {
    if (!ConfigUtils.instance) {
      ConfigUtils.instance = new ConfigUtils();
    }
    return ConfigUtils.instance;
  }

  get(key: string) {
    return this.env[key];
  }
}

export { ConfigUtils };
