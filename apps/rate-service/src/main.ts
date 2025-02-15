import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

import { CBSLogging } from '@app/shared/logging/logging.service';

import { RateServiceModule } from './rate-service.module';
import { swaggerConfig, EnvClass } from './config';

async function bootstrap() {
  const app = await NestFactory.create(RateServiceModule, {
    bufferLogs: true,
    logger: false,
  });

  app.useLogger(new CBSLogging());
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  const config = EnvClass.getInstance();
  const port = config.get('serverPort');

  await app.listen(port);
  logger.log(`rate service start listening on post : ${port} `);
}

const logger = new CBSLogging();
bootstrap().catch((err) => {
  logger.error(`Error starting the rate-service: ${err}`);
});
