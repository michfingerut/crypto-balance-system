import { NestFactory } from '@nestjs/core';
import { BalanceServiceModule } from './balance-service.module';
import { CBSLogging } from '@app/shared/logging/logging.controller';

async function bootstrap() {
  const app = await NestFactory.create(BalanceServiceModule);
  //TODO: config
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
