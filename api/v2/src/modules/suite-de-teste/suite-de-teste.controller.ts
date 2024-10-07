import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateSuiteDeTesteDto } from './dto/create-suite-de-teste.dto';
import { UpdateSuiteDeTesteDto } from './dto/update-suite-de-teste.dto';
import { SuiteDeTesteService } from './suite-de-teste.service';

@ApiTags('Suite de Teste')
@Controller('suite-de-teste')
export class SuiteDeTesteController {
  constructor(private readonly suiteDeTesteService: SuiteDeTesteService) {}

  @Post()
  create(@Body() createSuiteDeTesteDto: CreateSuiteDeTesteDto) {
    return this.suiteDeTesteService.create(createSuiteDeTesteDto);
  }

  @Get()
  findAll() {
    return this.suiteDeTesteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suiteDeTesteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSuiteDeTesteDto: UpdateSuiteDeTesteDto,
  ) {
    return this.suiteDeTesteService.update(+id, updateSuiteDeTesteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suiteDeTesteService.remove(+id);
  }

  @Get(':id/run')
  runSuite(@Param('id') id: string) {
    return this.suiteDeTesteService.runSuite(+id);
  }
}
