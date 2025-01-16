import { LogLevel } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function configApp(): Promise<[number, LogLevel[]]> {
  const configModule = await NestFactory.createApplicationContext(
    ConfigModule.forRoot(),
  );
  const configService = configModule.get(ConfigService);
  const port = +configService.get<number>('APP_PORT', 3000);
  const isDev =
    configService.get<string>('APP_ENV', 'production') === 'development';
  const logger: LogLevel[] = isDev
    ? ['debug', 'error', 'fatal', 'log', 'verbose', 'warn']
    : ['error', 'fatal', 'log', 'verbose', 'warn'];

  return [port, logger];
}

async function bootstrap() {
  const [port, logger] = await configApp();
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  await app.listen(port);
}
bootstrap();
