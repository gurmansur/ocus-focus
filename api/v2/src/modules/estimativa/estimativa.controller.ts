import { Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { EstimativaService } from './estimativa.service';

@ApiTags('Estimativa')
@Controller('estimativa')
export class EstimativaController extends BaseController {
  constructor(private readonly estimativaService: EstimativaService) {
    super();
  }

  @Get()
  findAll(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.estimativaService.findAll(projetoId, page, pageSize);
  }

  @Post('new')
  create(@Query('projeto') projetoId: string) {
    return this.estimativaService.create(+projetoId);
  }
}
