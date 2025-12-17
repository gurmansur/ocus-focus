import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ProjetoAtual = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentProject;
  },
);
