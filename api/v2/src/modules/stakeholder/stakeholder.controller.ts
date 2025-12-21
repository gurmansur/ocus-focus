import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { CreateStakeholderDto } from './dto/create-stakeholder.dto';
import { StakeholderService } from './stakeholder.service';

@ApiTags('Stakeholder')
@Controller()
export class StakeholderController extends BaseController {
  constructor(private readonly stakeholderService: StakeholderService) {
    super();
  }

  @Post('create-stakeholder')
  create(@Body() createStakeholderDto: CreateStakeholderDto) {
    return this.stakeholderService.create(createStakeholderDto);
  }

  @Get('stakeholders/findByProjeto')
  findByProjeto(
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.stakeholderService.findByProjeto(projetoId, page, pageSize);
  }

  @Get('stakeholders/findByNome')
  findByNome(
    @Query('nome') nome: string,
    @Query('projeto') projetoId: number,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.stakeholderService.findByNome(nome, projetoId, page, pageSize);
  }

  @HttpCode(200)
  @Get('stakeholders/verifyParticipation')
  verifyParticipation(@Query('projetoId') projetoId: number) {
    return this.stakeholderService.verifyParticipation(projetoId);
  }

  @Delete('stakeholders/delete')
  remove(@Query('stakeholder', ParseIntPipe) id: number) {
    return this.stakeholderService.remove(+id);
  }

  @Patch('stakeholders/alert')
  update(@Query('id', ParseIntPipe) id: number) {
    return this.stakeholderService.updateAlert(+id);
  }
}
