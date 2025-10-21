import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    // Verifica se já existe cliente com o mesmo e-mail
    const existingEmail = await this.customerRepository.findOne({
      where: { email: createCustomerDto.email },
    });

    if (existingEmail) {
      throw new ConflictException('E-mail já cadastrado');
    }

    // Verifica se já existe cliente com o mesmo documento
    const existingDocument = await this.customerRepository.findOne({
      where: { document: createCustomerDto.document },
    });

    if (existingDocument) {
      throw new ConflictException('Documento já cadastrado');
    }

    const customer = this.customerRepository.create(createCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find({
      relations: ['charges'],
    });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: ['charges'],
    });

    if (!customer) {
      throw new NotFoundException(`Cliente com ID ${id} não encontrado`);
    }

    return customer;
  }

  async update(
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    const customer = await this.findOne(id);

    // Verifica conflitos de e-mail se estiver sendo atualizado
    if (updateCustomerDto.email && updateCustomerDto.email !== customer.email) {
      const existingEmail = await this.customerRepository.findOne({
        where: { email: updateCustomerDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('E-mail já cadastrado');
      }
    }

    // Verifica conflitos de documento se estiver sendo atualizado
    if (
      updateCustomerDto.document &&
      updateCustomerDto.document !== customer.document
    ) {
      const existingDocument = await this.customerRepository.findOne({
        where: { document: updateCustomerDto.document },
      });

      if (existingDocument) {
        throw new ConflictException('Documento já cadastrado');
      }
    }

    Object.assign(customer, updateCustomerDto);
    return await this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.remove(customer);
  }
}

