import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '1234',
  database: process.env.DATABASE_NAME || 'postgres',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Apenas para desenvolvimento
  logging: process.env.NODE_ENV !== 'production',
});

