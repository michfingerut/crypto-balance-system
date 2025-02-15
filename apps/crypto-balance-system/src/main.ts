import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { CBSLogging } from '@app/shared/logging/logging.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: false,
  });

  // Set up ONLY our custom logger
  app.useLogger(logger);
  const port = 3000;
  logger.log(`App start listening on post : ${port} `);

  await app.listen(port);
}

const logger = new CBSLogging();

bootstrap().catch((err) => {
  logger.error(`Error starting the app: ${err}`);
});
