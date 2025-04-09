import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get hello message' })
  @ApiResponse({ status: 200, description: 'Returns a welcome message' })
  getHello(): string {
    this.logger.log('GET / endpoint called');
    return this.appService.getHello();
  }

  @Get('status')
  @ApiOperation({ summary: 'Get API status' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns the current status of the API',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2023-04-08T12:00:00.000Z' },
        version: { type: 'string', example: '1.0.0' }
      }
    }
  })
  getStatus() {
    this.logger.log('GET /status endpoint called');
    return this.appService.getStatus();
  }

  @Get('info')
  @ApiOperation({ summary: 'Get API information' })
  @ApiResponse({ 
    status: 200, 
    description: 'Returns information about the API',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        version: { type: 'string' },
        description: { type: 'string' },
        environment: { type: 'string' },
        uptime: { type: 'number' }
      }
    }
  })
  getInfo() {
    this.logger.log('GET /info endpoint called');
    return this.appService.getInfo();
  }
} 