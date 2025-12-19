import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comentario } from '../user-story/entities/comentario.entity';
import { UserStory } from '../user-story/entities/user-story.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Notificacao } from './entities/notificacao.entity';

@Injectable()
export class NotificacaoService {
  constructor(
    @InjectRepository(Notificacao)
    private readonly notificacaoRepository: Repository<Notificacao>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(UserStory)
    private readonly userStoryRepository: Repository<UserStory>,
    @InjectRepository(Comentario)
    private readonly comentarioRepository: Repository<Comentario>,
  ) {}

  async createForMentions(
    destinatarioUsuarioIds: number[] | undefined,
    opts: {
      remetenteUsuarioId: number;
      userStoryId: number;
      comentarioId: number;
      mensagem: string;
    },
  ) {
    if (!destinatarioUsuarioIds || destinatarioUsuarioIds.length === 0) {
      return [];
    }

    const uniqueIds = Array.from(new Set(destinatarioUsuarioIds)).filter(
      (id) => id !== opts.remetenteUsuarioId,
    );
    if (uniqueIds.length === 0) return [];

    const destinatarios = await this.usuarioRepository.findByIds(uniqueIds);
    const remetente = await this.usuarioRepository.findOne({
      where: { id: opts.remetenteUsuarioId },
    });
    const userStory = await this.userStoryRepository.findOne({
      where: { id: opts.userStoryId },
    });
    const comentario = await this.comentarioRepository.findOne({
      where: { id: opts.comentarioId },
    });

    const records = destinatarios.map((dest) =>
      this.notificacaoRepository.create({
        mensagem: opts.mensagem,
        destinatario: dest,
        remetente,
        userStory,
        comentario,
        lido: false,
      }),
    );

    return this.notificacaoRepository.save(records);
  }

  async findByUsuario(usuarioId: number) {
    const items = await this.notificacaoRepository.find({
      where: { destinatario: { id: usuarioId } },
      relations: ['userStory', 'userStory.projeto', 'comentario'],
      order: { lido: 'ASC', criado_em: 'DESC' },
    });
    return items.map((n) => ({
      id: n.id,
      mensagem: n.mensagem,
      lido: !!n.lido,
      criado_em: n.criado_em,
      userStoryId: n.userStory?.id || null,
      projetoId: n.userStory?.projeto?.id || null,
      comentarioId: n.comentario?.id || null,
    }));
  }

  async markRead(id: number) {
    await this.notificacaoRepository.update(id, { lido: true });
    return { success: true };
  }
}
