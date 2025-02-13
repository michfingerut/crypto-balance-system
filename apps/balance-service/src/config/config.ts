import * as dotenv from 'dotenv';

import { BalanceEnv } from '../utils/types';

class ConfigUtils {
  private static instance: ConfigUtils;
  private env: BalanceEnv;

  private constructor() {
    dotenv.config({ path: './apps/rate-service/.env' });

    this.env = {
      serverPort: parseInt(process.env.SERVER_PORT || '3001'),
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
