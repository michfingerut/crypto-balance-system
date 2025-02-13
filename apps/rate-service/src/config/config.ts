import * as dotenv from 'dotenv';

import { RateEnv } from '../utils/types';

class ConfigUtils {
  private static instance: ConfigUtils;
  private env: RateEnv;

  private constructor() {
    dotenv.config({ path: './apps/rate-service/.env' });

    this.env = {
      rateRefreshInterval:
        parseInt(process.env.RATE_REFRESH_INTERVAL as string) || 600000,
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
