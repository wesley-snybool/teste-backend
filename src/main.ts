import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilita CORS
  app.enableCors();

  // Configuração de validação global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtro global de exceções
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Pagamentos API')
    .setDescription(
      'API RESTful para gerenciamento de clientes e cobranças com suporte a Pix, Cartão de Crédito e Boleto Bancário. Inclui autenticação JWT com controle de acesso baseado em roles (admin/user).',
    )
    .setVersion('2.0')
    .addTag('Health', 'Health check da aplicação')
    .addTag('Auth', 'Autenticação e autorização')
    .addTag('Users', 'Gerenciamento de usuários')
    .addTag('Customers', 'Gerenciamento de clientes')
    .addTag('Charges', 'Gerenciamento de cobranças')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Insira o token JWT obtido no login',
        in: 'header',
      },
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.log(`\n🚀 Aplicação rodando em: http://localhost:${port}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/api/docs\n`);
}
bootstrap();
