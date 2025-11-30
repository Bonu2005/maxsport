import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors({
    origin: [
   "*"
    ], // сюда добавляйте нужные фронтенд-домены
    credentials: false,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });
  // ---
  const config = new DocumentBuilder()
    .setTitle('MaxSport API')
    .setDescription('Authentication API for MaxSport project')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();





