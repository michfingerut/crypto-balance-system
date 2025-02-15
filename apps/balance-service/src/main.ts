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
  app.useLogger(logger);

  const config = ConfigUtils.getInstance();
  const port = config.get('serverPort');
  await app.listen(port);
  logger.log(`Balance service start listening on post : ${port} `);
}

const logger = new CBSLogging();
bootstrap().catch((err) => {
  logger.error(`Error starting the balance-service: ${err}`);
});
