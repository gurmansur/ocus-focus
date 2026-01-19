import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioProjeto } from './entities/usuario-projeto.entity';
import { UsuarioProjetoController } from './usuario-projeto.controller';
import { UsuarioProjetoService } from './usuario-projeto.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioProjeto])],
  controllers: [UsuarioProjetoController],
  providers: [UsuarioProjetoService],
  exports: [UsuarioProjetoService],
})
export class UsuarioProjetoModule {}
