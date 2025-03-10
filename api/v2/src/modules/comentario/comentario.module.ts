import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { ComentarioController } from './comentario.controller';
import { ComentarioService } from './comentario.service';
import { Comentario } from './entities/comentario.entity';

@Module({
  controllers: [ComentarioController],
  providers: [ComentarioService],
  imports: [TypeOrmModule.forFeature([Comentario, Colaborador, UserStory])],
})
export class ComentarioModule {}
