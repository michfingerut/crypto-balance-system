import { NestFactory } from '@nestjs/core';
import { BalanceServiceModule } from './balance-service.module';

async function bootstrap() {
  //TODO: the file should be generated here if not exist
  const app = await NestFactory.create(BalanceServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
