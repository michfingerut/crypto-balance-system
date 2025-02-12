import { NestFactory } from '@nestjs/core';

//import { CBSLogging } from '@app/shared/logging/logging.controller';

import { BalanceServiceModule } from './balance-service.module';

async function bootstrap() {
  //TODO: the file should be generated here if not exist
  const app = await NestFactory.create(BalanceServiceModule);
  // , {
  //   bufferLogs: true,
  // });
  // app.useLogger(app.get(CBSLogging));

  //TODO: add config

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
