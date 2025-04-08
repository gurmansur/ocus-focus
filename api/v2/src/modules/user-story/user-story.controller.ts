import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiOperation, ApiParam, ApiQuery, ApiBody, ApiResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ProtectedRoute } from '../../decorators/protected-route.decorator';
import { CreateUserStoryDto } from './dto/create-user-story.dto';
import { UpdateUserStoryDto } from './dto/update-user-story.dto';
import { UserStoryService } from './user-story.service';

@ApiTags('User Story')
@ApiBearerAuth()
@Controller('user-story')
export class UserStoryController {
  constructor(private readonly userStoryService: UserStoryService) {}

  /**
   * Cria uma nova história de usuário
   * @param createUserStoryDto Dados da história de usuário
   * @returns A história de usuário criada
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Post()
  @ApiOperation({ summary: "Criar", description: "Cria um novo recurso" })
  @ApiCreatedResponse({ description: "Recurso criado com sucesso" })
  @ApiOperation({ summary: "Criar", description: "Cria um novo recurso" })
  @ApiCreatedResponse({ description: "Recurso criado com sucesso" })
  @ApiOkResponse({ description: 'História de usuário criada com sucesso' })
  create(@Body() createUserStoryDto: CreateUserStoryDto) {
    return this.userStoryService.create(createUserStoryDto);
  }

  /**
   * Lista todas as histórias de usuário
   * @returns Lista de histórias de usuário
   */
  @ProtectedRoute()
  @Get()
  @ApiOperation({ summary: "Buscar", description: "Busca recursos específicos" })
  @ApiOperation({ summary: "Listar", description: "Lista todos os recursos" })
  @ApiOkResponse({ description: 'Lista de histórias de usuário' })
  findAll() {
    return this.userStoryService.findAll();
  }

  /**
   * Busca histórias de usuário por projeto
   * @param projetoId ID do projeto
   * @returns Lista de histórias de usuário
   */
  @ProtectedRoute()
  @Get('findByProjeto')
  @ApiOperation({ summary: "Buscar", description: "Busca recursos específicos" })
  @ApiOkResponse({ description: 'Histórias de usuário por projeto' })
  findByProjeto(@Query('projetoId') projetoId: string) {
    return this.userStoryService.findByProjeto(+projetoId);
  }

  /**
   * Busca uma história de usuário por ID
   * @param id ID da história de usuário
   * @returns A história de usuário encontrada
   */
  @ProtectedRoute()
  @Get(':id')
  @ApiOperation({ summary: "Buscar", description: "Busca recursos específicos" })
  @ApiOkResponse({ description: 'História de usuário encontrada' })
  findOne(@Param('id') id: string) {
    return this.userStoryService.findOne(+id);
  }

  /**
   * Atualiza uma história de usuário
   * @param id ID da história de usuário
   * @param updateUserStoryDto Dados para atualização
   * @returns A história de usuário atualizada
   */
  @ProtectedRoute('admin', 'gerente', 'analista')
  @Patch(':id')
  @ApiOperation({ summary: "Atualizar", description: "Atualiza um recurso existente" })
  @ApiResponse({ status: 200, description: "Recurso atualizado com sucesso" })
  @ApiOkResponse({ description: 'História de usuário atualizada com sucesso' })
  update(
    @Param('id') id: string,
    @Body() updateUserStoryDto: UpdateUserStoryDto,
  ) {
    return this.userStoryService.update(+id, updateUserStoryDto);
  }

  /**
   * Remove uma história de usuário
   * @param id ID da história de usuário
   * @returns Confirmação de remoção
   */
  @ProtectedRoute('admin', 'gerente')
  @Delete(':id')
  @ApiOperation({ summary: "Remover", description: "Remove um recurso" })
  @ApiResponse({ status: 200, description: "Recurso removido com sucesso" })
  @ApiOkResponse({ description: 'História de usuário removida com sucesso' })
  remove(@Param('id') id: string) {
    return this.userStoryService.remove(+id);
  }
}
