import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const optios = new DocumentBuilder()
    .setTitle('RiqMe')
    .setDescription('This is a streaming anime API using NestJS')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, optios);
  SwaggerModule.setup('docs', app, document);

  await app.listen(configService.get('PORT') ?? 3000);
}
void bootstrap();
