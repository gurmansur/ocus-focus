import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BaseController } from '../../common/base/base.controller';
import { ColaboradorAtual } from '../../decorators/colaborador-atual.decorator';
import { Serialize } from '../../decorators/serialize.decorator';
import { AuthGuard } from '../../guards/auth.guard';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { BillingService } from './billing.service';
import { AssinaturaDto } from './dto/assinatura.dto';
import { CreateAssinaturaDto } from './dto/create-assinatura.dto';
import { CreatePlanoDto } from './dto/create-plano.dto';
import { PlanoDto } from './dto/plano.dto';
import { UpdateAssinaturaDto } from './dto/update-assinatura.dto';
import { UpdatePlanoDto } from './dto/update-plano.dto';

@ApiTags('Billing')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Não autorizado' })
@UseGuards(AuthGuard)
@Serialize()
@Controller('billing')
export class BillingController extends BaseController {
  constructor(private readonly billingService: BillingService) {
    super();
  }

  // ==================== PLANOS ====================

  @ApiOperation({ summary: 'Criar novo plano' })
  @ApiResponse({ status: 201, type: PlanoDto })
  @Post('planos')
  async createPlano(@Body() createPlanoDto: CreatePlanoDto): Promise<PlanoDto> {
    return this.billingService.createPlano(createPlanoDto);
  }

  @ApiOperation({ summary: 'Listar todos os planos ativos' })
  @ApiResponse({ status: 200, type: [PlanoDto] })
  @Get('planos')
  async findAllPlanos(): Promise<PlanoDto[]> {
    return this.billingService.findAllPlanos();
  }

  @ApiOperation({ summary: 'Buscar plano por ID' })
  @ApiResponse({ status: 200, type: PlanoDto })
  @Get('planos/:id')
  async findPlanoById(@Param('id') id: string): Promise<PlanoDto> {
    return this.billingService.findPlanoById(+id);
  }

  @ApiOperation({ summary: 'Atualizar plano' })
  @ApiResponse({ status: 200, type: PlanoDto })
  @Patch('planos/:id')
  async updatePlano(
    @Param('id') id: string,
    @Body() updatePlanoDto: UpdatePlanoDto,
  ): Promise<PlanoDto> {
    return this.billingService.updatePlano(+id, updatePlanoDto);
  }

  @ApiOperation({ summary: 'Desativar plano' })
  @ApiResponse({ status: 200 })
  @Delete('planos/:id')
  async deletePlano(@Param('id') id: string): Promise<void> {
    return this.billingService.deletePlano(+id);
  }

  // ==================== ASSINATURAS ====================

  @ApiOperation({ summary: 'Criar nova assinatura' })
  @ApiResponse({ status: 201, type: AssinaturaDto })
  @Post('assinaturas')
  async createAssinatura(
    @Body() createAssinaturaDto: CreateAssinaturaDto,
    @ColaboradorAtual() colaborador: Colaborador,
  ): Promise<AssinaturaDto> {
    return this.billingService.createAssinatura(
      createAssinaturaDto,
      colaborador.usuario,
    );
  }

  @ApiOperation({ summary: 'Listar minhas assinaturas' })
  @ApiResponse({ status: 200, type: [AssinaturaDto] })
  @Get('assinaturas/minhas')
  async findMinhasAssinaturas(
    @ColaboradorAtual() colaborador: Colaborador,
  ): Promise<AssinaturaDto[]> {
    return this.billingService.findAssinaturasByUsuario(colaborador.usuario);
  }

  @ApiOperation({ summary: 'Buscar assinatura ativa' })
  @ApiResponse({ status: 200, type: AssinaturaDto })
  @Get('assinaturas/ativa')
  async findAssinaturaAtiva(
    @ColaboradorAtual() colaborador: Colaborador,
  ): Promise<AssinaturaDto | null> {
    return this.billingService.findAssinaturaAtiva(colaborador.usuario);
  }

  @ApiOperation({ summary: 'Buscar assinatura por ID' })
  @ApiResponse({ status: 200, type: AssinaturaDto })
  @Get('assinaturas/:id')
  async findAssinaturaById(@Param('id') id: string): Promise<AssinaturaDto> {
    return this.billingService.findAssinaturaById(+id);
  }

  @ApiOperation({ summary: 'Atualizar assinatura' })
  @ApiResponse({ status: 200, type: AssinaturaDto })
  @Patch('assinaturas/:id')
  async updateAssinatura(
    @Param('id') id: string,
    @Body() updateAssinaturaDto: UpdateAssinaturaDto,
  ): Promise<AssinaturaDto> {
    return this.billingService.updateAssinatura(+id, updateAssinaturaDto);
  }

  @ApiOperation({ summary: 'Cancelar assinatura' })
  @ApiResponse({ status: 200, type: AssinaturaDto })
  @Post('assinaturas/:id/cancelar')
  async cancelarAssinatura(@Param('id') id: string): Promise<AssinaturaDto> {
    return this.billingService.cancelarAssinatura(+id);
  }

  @ApiOperation({ summary: 'Reativar assinatura' })
  @ApiResponse({ status: 200, type: AssinaturaDto })
  @Post('assinaturas/:id/reativar')
  async reativarAssinatura(@Param('id') id: string): Promise<AssinaturaDto> {
    return this.billingService.reativarAssinatura(+id);
  }

  @ApiOperation({ summary: 'Verificar limites da assinatura atual' })
  @ApiResponse({ status: 200 })
  @Get('limites')
  async verificarLimites(@ColaboradorAtual() colaborador: Colaborador) {
    return this.billingService.verificarLimitesAssinatura(colaborador.usuario);
  }
}
