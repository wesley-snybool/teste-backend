import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './config/database.config';
import { CustomersModule } from './customers/customers.module';
import { ChargesModule } from './charges/charges.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig()),
    CustomersModule,
    ChargesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
