import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Rate Service')
  .setDescription('The rate service API')
  .setVersion('1.0')
  .addTag('rates')
  .build();
