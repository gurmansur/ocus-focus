import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../guards/auth.guard';
import { EstimativaService } from './estimativa.service';

@UseGuards(AuthGuard)
@ApiTags('Estimativa')
@Controller('estimativa')
export class EstimativaController {
  constructor(private readonly estimativaService: EstimativaService) {}

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
