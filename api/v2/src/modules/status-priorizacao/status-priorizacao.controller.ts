import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { UpdateStatusPriorizacaoDto } from './dto/update-status-priorizacao.dto';
import { StatusPriorizacaoService } from './status-priorizacao.service';

@ApiTags('Status-priorização')
@Controller('status-priorizacao')
export class StatusPriorizacaoController extends BaseController {
  constructor(
    private readonly statusPriorizacaoService: StatusPriorizacaoService,
  ) {
    super();
  }

  // @Post()
  // create(@Body() createStatusPriorizacaoDto: CreateStatusPriorizacaoDto) {
  //   return this.statusPriorizacaoService.create(createStatusPriorizacaoDto);
  // }

  @Get()
  findAll() {
    return this.statusPriorizacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.statusPriorizacaoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStatusPriorizacaoDto: UpdateStatusPriorizacaoDto,
  ) {
    return this.statusPriorizacaoService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.statusPriorizacaoService.remove(+id);
  }
}
