import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Balance Service')
  .setDescription('The balance service API')
  .setVersion('1.0')
  .addTag('balances')
  .build();
