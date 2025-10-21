import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { Charge } from './entities/charge.entity';
import { CustomersService } from '../customers/customers.service';
import { PaymentMethod } from './enums/payment-method.enum';
import { ChargeStatus } from './enums/charge-status.enum';
import { randomUUID } from 'crypto';

@Injectable()
export class ChargesService {
  constructor(
    @InjectRepository(Charge)
    private readonly chargeRepository: Repository<Charge>,
    private readonly customersService: CustomersService,
  ) {}

  async create(createChargeDto: CreateChargeDto): Promise<Charge> {
    // Verifica se o cliente existe
    const customer = await this.customersService.findOne(
      createChargeDto.customerId,
    );

    if (!customer) {
      throw new NotFoundException('Cliente não encontrado');
    }

    // Valida detalhes específicos de cada método de pagamento
    this.validatePaymentDetails(createChargeDto);

    // Cria a cobrança
    const charge = this.chargeRepository.create({
      customerId: createChargeDto.customerId,
      amount: createChargeDto.amount,
      currency: createChargeDto.currency || 'BRL',
      paymentMethod: createChargeDto.paymentMethod,
      description: createChargeDto.description,
      status: ChargeStatus.PENDING,
    });

    // Adiciona dados específicos de cada método
    this.addPaymentMethodSpecificData(charge, createChargeDto);

    return await this.chargeRepository.save(charge);
  }

  private validatePaymentDetails(createChargeDto: CreateChargeDto): void {
    const { paymentMethod, paymentDetails } = createChargeDto;

    switch (paymentMethod) {
      case PaymentMethod.PIX:
        // Pix não requer validações adicionais
        break;

      case PaymentMethod.CREDIT_CARD:
        if (!paymentDetails?.cardNumber) {
          throw new BadRequestException(
            'Número do cartão é obrigatório para pagamento com cartão de crédito',
          );
        }
        if (!paymentDetails?.cardHolderName) {
          throw new BadRequestException(
            'Nome do titular é obrigatório para pagamento com cartão de crédito',
          );
        }
        if (!paymentDetails?.cardExpiration) {
          throw new BadRequestException(
            'Data de validade é obrigatória para pagamento com cartão de crédito',
          );
        }
        if (!paymentDetails?.cardCvv) {
          throw new BadRequestException(
            'CVV é obrigatório para pagamento com cartão de crédito',
          );
        }
        break;

      case PaymentMethod.BANK_SLIP:
        if (!paymentDetails?.bankSlipDueDate) {
          throw new BadRequestException(
            'Data de vencimento é obrigatória para pagamento com boleto',
          );
        }
        // Valida se a data de vencimento é futura
        const dueDate = new Date(paymentDetails.bankSlipDueDate);
        if (dueDate <= new Date()) {
          throw new BadRequestException(
            'Data de vencimento deve ser uma data futura',
          );
        }
        break;
    }
  }

  private addPaymentMethodSpecificData(
    charge: Charge,
    createChargeDto: CreateChargeDto,
  ): void {
    const { paymentMethod, paymentDetails } = createChargeDto;

    switch (paymentMethod) {
      case PaymentMethod.PIX:
        // Simula geração de QR Code e define expiração
        charge.pixQrCode = this.generatePixQrCode();
        charge.pixExpiration = paymentDetails?.pixExpiration
          ? new Date(paymentDetails.pixExpiration)
          : this.getDefaultPixExpiration();
        break;

      case PaymentMethod.CREDIT_CARD:
        // Armazena apenas os últimos 4 dígitos do cartão
        if (paymentDetails?.cardNumber) {
          charge.cardLastDigits = paymentDetails.cardNumber.slice(-4);
          charge.cardBrand = this.detectCardBrand(paymentDetails.cardNumber);
          charge.installments = paymentDetails.installments || 1;
        }
        break;

      case PaymentMethod.BANK_SLIP:
        // Simula geração de código de barras e URL do boleto
        charge.bankSlipCode = this.generateBankSlipCode();
        if (paymentDetails?.bankSlipDueDate) {
          charge.bankSlipDueDate = new Date(paymentDetails.bankSlipDueDate);
        }
        charge.bankSlipUrl = this.generateBankSlipUrl(charge.bankSlipCode);
        break;
    }
  }

  // Métodos auxiliares para simulação
  private generatePixQrCode(): string {
    // Simula um QR Code Pix
    return `00020126360014BR.GOV.BCB.PIX0114${randomUUID()}5204000053039865802BR5925NOME DO BENEFICIARIO6009SAO PAULO62070503***6304${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  }

  private getDefaultPixExpiration(): Date {
    // Pix expira em 24 horas por padrão
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 24);
    return expiration;
  }

  private detectCardBrand(cardNumber: string): string {
    // Detecta a bandeira do cartão pelo primeiro dígito
    const firstDigit = cardNumber[0];
    const brands = {
      '4': 'Visa',
      '5': 'Mastercard',
      '3': 'American Express',
      '6': 'Discover',
    };
    return brands[firstDigit] || 'Unknown';
  }

  private generateBankSlipCode(): string {
    // Simula código de barras do boleto
    return Array.from({ length: 47 }, () => Math.floor(Math.random() * 10)).join(
      '',
    );
  }

  private generateBankSlipUrl(code: string): string {
    // Simula URL para visualização do boleto
    return `https://example.com/boleto/${code}`;
  }

  async findAll(customerId?: string): Promise<Charge[]> {
    const where = customerId ? { customerId } : {};
    return await this.chargeRepository.find({
      where,
      relations: ['customer'],
    });
  }

  async findOne(id: string): Promise<Charge> {
    const charge = await this.chargeRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!charge) {
      throw new NotFoundException(`Cobrança com ID ${id} não encontrada`);
    }

    return charge;
  }

  async update(id: string, updateChargeDto: UpdateChargeDto): Promise<Charge> {
    const charge = await this.findOne(id);

    // Valida transição de status
    if (updateChargeDto.status) {
      this.validateStatusTransition(charge.status, updateChargeDto.status);
    }

    Object.assign(charge, updateChargeDto);
    return await this.chargeRepository.save(charge);
  }

  private validateStatusTransition(
    currentStatus: ChargeStatus,
    newStatus: ChargeStatus,
  ): void {
    // Não permite alterar status de cobranças já pagas ou canceladas
    if (
      currentStatus === ChargeStatus.PAID ||
      currentStatus === ChargeStatus.CANCELLED
    ) {
      throw new BadRequestException(
        `Não é possível alterar o status de uma cobrança ${currentStatus === ChargeStatus.PAID ? 'paga' : 'cancelada'}`,
      );
    }

    // Valida transições válidas
    const validTransitions = {
      [ChargeStatus.PENDING]: [
        ChargeStatus.PAID,
        ChargeStatus.FAILED,
        ChargeStatus.EXPIRED,
        ChargeStatus.CANCELLED,
      ],
      [ChargeStatus.FAILED]: [ChargeStatus.PENDING, ChargeStatus.CANCELLED],
      [ChargeStatus.EXPIRED]: [ChargeStatus.CANCELLED],
    };

    if (
      newStatus &&
      !validTransitions[currentStatus]?.includes(newStatus)
    ) {
      throw new BadRequestException(
        `Transição de status de ${currentStatus} para ${newStatus} não é válida`,
      );
    }
  }

  async remove(id: string): Promise<void> {
    const charge = await this.findOne(id);
    await this.chargeRepository.remove(charge);
  }
}

