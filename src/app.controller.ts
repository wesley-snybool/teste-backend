import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Health check da aplicação' })
  @ApiResponse({ status: 200, description: 'Aplicação está funcionando' })
  getHello(): object {
    return this.appService.getHello();
  }
}
