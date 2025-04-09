import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.log('AppService.getHello() called');
    return 'Hello World! Welcome to Ocus Focus API';
  }

  getStatus(): { status: string; timestamp: string; version: string } {
    this.logger.log('AppService.getStatus() called');
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
    };
  }

  getInfo(): object {
    this.logger.log('AppService.getInfo() called');
    return {
      name: 'Ocus Focus API',
      version: '1.0.0',
      description: 'REST API for Ocus Focus application',
      environment: process.env.NODE_ENV || 'development',
      uptime: process.uptime(),
    };
  }
}
