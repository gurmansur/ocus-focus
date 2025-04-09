import { SetMetadata } from '@nestjs/common';

export enum Role {
  GERENTE_PROJETO = 'Gerente de Projeto',
  ANALISTA_SISTEMAS = 'Analista de Sistemas',
  DESENVOLVEDOR = 'Desenvolvedor',
  PRODUCT_OWNER = 'Product Owner',
  SCRUM_MASTER = 'Scrum Master',
}

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);
