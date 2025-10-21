import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'Sistema de Pagamentos API',
      version: '1.0',
      status: 'running',
      documentation: '/api/docs',
    };
  }
}
