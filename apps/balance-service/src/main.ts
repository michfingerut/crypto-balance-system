import { NestFactory } from '@nestjs/core';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { BalanceServiceModule } from './balance-service.module';

async function bootstrap() {
  const app = await NestFactory.create(BalanceServiceModule, {
    bufferLogs: true,
    logger: false,
  });

  // Set up ONLY our custom logger
  app.useLogger(new CBSLogging());

  //TODO: config + env

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
