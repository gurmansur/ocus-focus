import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ColaboradorModule } from '../colaborador/colaborador.module';
import { Colaborador } from '../colaborador/entities/colaborador.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { UserStoryModule } from '../user-story/user-story.module';
import { ComentarioController } from './comentario.controller';
import { ComentarioService } from './comentario.service';
import { Comentario } from './entities/comentario.entity';

@Module({
  controllers: [ComentarioController],
  providers: [ComentarioService],
  imports: [
    TypeOrmModule.forFeature([Comentario, Colaborador, UserStory]),
    ColaboradorModule,
    UserStoryModule,
  ],
})
export class ComentarioModule {}
