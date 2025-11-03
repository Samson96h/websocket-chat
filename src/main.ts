import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, Logger, ValidationPipe } from '@nestjs/common';

import { CustomWsAdapter } from './modules/ws-adapter';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const port = process.env.PORT || 4001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  app.enableCors()
  app.useWebSocketAdapter(new CustomWsAdapter(app));

  if (process.env.ENVIRONMENT === 'development') {
    const config = new DocumentBuilder()
      .setTitle('ws-chat')
      .setDescription('chat description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }
  await app.listen(port);

  logger.log(`         App running on port ${port}`);
}

bootstrap();
