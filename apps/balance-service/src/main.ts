import { NestFactory } from '@nestjs/core';
import { BalanceServiceModule } from './balance-service.module';
//import { CBSLogging } from '@app/shared/logging/logging.controller';

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
