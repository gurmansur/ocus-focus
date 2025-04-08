import {
  BadRequestException,
  Injectable,
  ValidationPipe as NestValidationPipe,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe
  extends NestValidationPipe
  implements PipeTransform<any>
{
  constructor() {
    super({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const messages = this.formatErrors(validationErrors);
        return new BadRequestException({
          status: 'error',
          message: 'Erro de validação',
          errors: messages,
        });
      },
    });
  }

  private formatErrors(errors: ValidationError[]): string[] {
    return errors.flatMap((error) => {
      if (error.constraints) {
        return Object.values(error.constraints);
      }

      if (error.children && error.children.length > 0) {
        return this.formatErrors(error.children);
      }

      return [];
    });
  }
}
