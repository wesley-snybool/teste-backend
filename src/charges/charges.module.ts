import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargesService } from './charges.service';
import { ChargesController } from './charges.controller';
import { Charge } from './entities/charge.entity';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Charge]), CustomersModule],
  controllers: [ChargesController],
  providers: [ChargesService],
})
export class ChargesModule {}

