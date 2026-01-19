import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ILogger } from '../../common/interfaces/logger.interface';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @Inject('ILogger') private logger: ILogger,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    this.logger.log('Creating new usuario');
    const usuario = this.usuarioRepository.create(createUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }

  findAll({
    email,
    name,
  }: {
    email?: string;
    name?: string;
  }): Promise<Usuario[]> {
    const queryBuilder = this.usuarioRepository.createQueryBuilder('usuario');

    if (email) {
      queryBuilder.andWhere('LOWER(usuario.email) LIKE LOWER(:email)', {
        email: `%${email}%`,
      });
    }

    if (name) {
      queryBuilder.andWhere('LOWER(usuario.nome) LIKE LOWER(:name)', {
        name: `%${name}%`,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Usuario> {
    return await this.usuarioRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({ where: { email } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    this.logger.log(`Updating usuario ${id}`);
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    Object.assign(usuario, updateUsuarioDto);
    return this.usuarioRepository.update(id, usuario);
  }

  async remove(id: number) {
    this.logger.warn(`Deleting usuario ${id}`);
    const usuario = await this.findOne(id);
    return await this.usuarioRepository.remove(usuario);
  }
}
