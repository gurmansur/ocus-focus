import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ColaboradorAtual } from '../../decorators/colaborador-atual.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { BillingService } from '../billing/billing.service';
import { ColaboradorService } from '../colaborador/colaborador.service';
import { ColaboradorDto } from '../colaborador/dto/colaborador.dto';
import { ColaboradorProjetoService } from './colaborador-projeto.service';
import { CreateColaboradorProjetoDto } from './dto/create-colaborador-projeto.dto';
import { UpdateColaboradorProjetoDto } from './dto/update-colaborador-projeto.dto';

@ApiTags('Colaborador-Projeto')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('colaborador-projeto')
export class ColaboradorProjetoController extends BaseController {
  constructor(
    private readonly colaboradorProjetoService: ColaboradorProjetoService,
    private readonly colaboradorService: ColaboradorService,
    private readonly billingService: BillingService,
  ) {
    super();
  }

  @Post()
  async create(
    @Body() createColaboradorProjetoDto: CreateColaboradorProjetoDto,
    @ColaboradorAtual() colaborador: ColaboradorDto,
  ) {
    // Load full colaborador to access usuario relationship
    const colaboradorFull = await this.colaboradorService.findOne(
      colaborador.id,
    );

    // Get subscription limits for the project creator
    const limites = await this.billingService.verificarLimitesAssinatura(
      colaboradorFull.usuario,
    );

    // Validate user limit on project
    if (limites.limiteUsuarios !== null) {
      const userCountOnProject =
        await this.colaboradorProjetoService.countUsersOnProject(
          createColaboradorProjetoDto.projeto.id,
        );

      if (userCountOnProject >= limites.limiteUsuarios) {
        throw new BadRequestException(
          `Limite de ${limites.limiteUsuarios} usuário(s) por projeto atingido. Faça upgrade de plano para adicionar mais usuários.`,
        );
      }
    }

    return this.colaboradorProjetoService.create(createColaboradorProjetoDto);
  }

  @Get()
  findAll() {
    return this.colaboradorProjetoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.colaboradorProjetoService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateColaboradorProjetoDto: UpdateColaboradorProjetoDto,
  ) {
    return this.colaboradorProjetoService.update(
      +id,
      updateColaboradorProjetoDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.colaboradorProjetoService.remove(+id);
  }
}
