import * as dotenv from 'dotenv';

import { RateEnv } from '../utils';

class ConfigUtils {
  private static instance: ConfigUtils;
  private env: RateEnv;

  private constructor() {
    dotenv.config({ path: './apps/rate-service/.env' });

    this.env = {
      rateRefreshInterval: parseInt(
        process.env.RATE_REFRESH_INTERVAL || '600000',
      ),
      serverPort: parseInt(process.env.SERVER_PORT || '3002'),
    };
  }

  static getInstance(): ConfigUtils {
    if (!ConfigUtils.instance) {
      ConfigUtils.instance = new ConfigUtils();
    }
    return ConfigUtils.instance;
  }

  get(key: 'serverPort' | 'rateRefreshInterval'): string | number {
    return this.env[key];
  }
}

export { ConfigUtils };
