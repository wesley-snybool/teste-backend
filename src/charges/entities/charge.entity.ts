import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';
import { ChargeStatus } from '../enums/charge-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

@Entity('charges')
export class Charge {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @ManyToOne(() => Customer, (customer) => customer.charges, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 3, default: 'BRL' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  paymentMethod: PaymentMethod;

  @Column({
    type: 'enum',
    enum: ChargeStatus,
    default: ChargeStatus.PENDING,
  })
  status: ChargeStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Campos específicos para Pix
  @Column({ name: 'pix_qr_code', type: 'text', nullable: true })
  pixQrCode: string;

  @Column({ name: 'pix_expiration', type: 'timestamp', nullable: true })
  pixExpiration: Date;

  // Campos específicos para Cartão de Crédito
  @Column({ name: 'card_last_digits', type: 'varchar', length: 4, nullable: true })
  cardLastDigits: string;

  @Column({ name: 'card_brand', type: 'varchar', length: 50, nullable: true })
  cardBrand: string;

  @Column({ name: 'installments', type: 'int', nullable: true, default: 1 })
  installments: number;

  // Campos específicos para Boleto
  @Column({ name: 'bank_slip_code', type: 'varchar', length: 100, nullable: true })
  bankSlipCode: string;

  @Column({ name: 'bank_slip_due_date', type: 'date', nullable: true })
  bankSlipDueDate: Date;

  @Column({ name: 'bank_slip_url', type: 'text', nullable: true })
  bankSlipUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

