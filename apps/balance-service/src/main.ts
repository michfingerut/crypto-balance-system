import { NestFactory } from '@nestjs/core';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { BalanceServiceModule } from './balance-service.module';
import { ConfigUtils } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(BalanceServiceModule, {
    bufferLogs: true,
    logger: false,
  });

  // Set up ONLY our custom logger
  app.useLogger(new CBSLogging());

  //TODO: config + env
  const config = ConfigUtils.getInstance();

  await app.listen(config.get('SERVER_PORT'));
}
bootstrap();
