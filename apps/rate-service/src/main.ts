import { NestFactory } from '@nestjs/core';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { RateServiceModule } from './rate-service.module';
import { ConfigUtils } from './config/config';

async function bootstrap() {
  const app = await NestFactory.create(RateServiceModule, {
    bufferLogs: true,
    logger: false,
  });

  app.useLogger(new CBSLogging());

  const config = ConfigUtils.getInstance();

  await app.listen(config.get('SERVER_PORT'));
}
bootstrap();
