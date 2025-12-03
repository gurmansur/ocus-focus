import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe as NestValidationPipe,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    
    if (errors.length > 0) {
      const messages = errors.map((error) => {
        // Obtém as mensagens de erro de cada propriedade
        const constraints = error.constraints 
          ? Object.values(error.constraints) 
          : ['Erro de validação'];
        
        return {
          campo: error.property,
          mensagens: constraints,
        };
      });
      
      throw new BadRequestException({
        mensagem: 'Erro de validação de dados',
        erros: messages,
      });
    }
    
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

/**
 * Pipe de validação global com configurações personalizadas
 */
export const GlobalValidationPipe = new NestValidationPipe({
  whitelist: true, // Remove propriedades não decoradas
  forbidNonWhitelisted: true, // Rejeita objetos com propriedades não decoradas
  transform: true, // Transforma tipos primitivos para seu tipo real
  transformOptions: {
    enableImplicitConversion: true, // Permite conversão implícita de tipos
  },
  // Personalização das mensagens de erro
  exceptionFactory: (errors) => {
    const formattedErrors = errors.map((error) => {
      const constraints = error.constraints ? Object.values(error.constraints) : ['Erro de validação'];
      
      return {
        campo: error.property,
        mensagens: constraints,
      };
    });
    
    return new BadRequestException({
      mensagem: 'Erro de validação de dados',
      erros: formattedErrors,
    });
  },
}); 