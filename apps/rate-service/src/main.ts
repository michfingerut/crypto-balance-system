import { NestFactory } from '@nestjs/core';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { RateServiceModule } from './rate-service.module';

async function bootstrap() {
  const app = await NestFactory.create(RateServiceModule, {
    bufferLogs: true,
    logger: false,
  });

  app.useLogger(new CBSLogging());

  //TODO: env
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
