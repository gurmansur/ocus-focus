import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateColaboradorProjetoDto } from './dto/create-colaborador-projeto.dto';
import { UpdateColaboradorProjetoDto } from './dto/update-colaborador-projeto.dto';
import { ColaboradorProjeto } from './entities/colaborador-projeto.entity';

@Injectable()
export class ColaboradorProjetoService {
  constructor(
    @InjectRepository(ColaboradorProjeto)
    private readonly colaboradorProjetoRepository: Repository<ColaboradorProjeto>,
  ) {}

  create(createColaboradorProjetoDto: CreateColaboradorProjetoDto) {
    return this.colaboradorProjetoRepository.save(createColaboradorProjetoDto);
  }

  findAll() {
    return `This action returns all colaboradorProjeto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} colaboradorProjeto`;
  }

  update(id: number, updateColaboradorProjetoDto: UpdateColaboradorProjetoDto) {
    return `This action updates a #${id} colaboradorProjeto`;
  }

  remove(id: number) {
    return `This action removes a #${id} colaboradorProjeto`;
  }

  removeByProjetoAndColaborador(projetoId: number, colaboradorId: number) {
    return this.colaboradorProjetoRepository.delete({
      projeto: { id: projetoId },
      colaborador: { id: colaboradorId },
    });
  }

  async findColaboradoresByProjetoId(
    projetoId: number,
    page?: number,
    pageSize?: number,
  ) {
    const take = pageSize ? pageSize : undefined;
    const skip = page ? (page - 1) * take : undefined;

    const colaboradores = await this.colaboradorProjetoRepository.find({
      where: { projeto: { id: projetoId } },
      relations: ['colaborador'],
      take: take,
      skip: skip,
    });

    return colaboradores.flatMap((colaboradorProjeto) => {
      const { senha, ...colaborador } = colaboradorProjeto.colaborador;
      return colaborador;
    });
  }

  async findColaboradoresByNome(
    projetoId: number,
    nome: string,
    page: number,
    pageSize: number,
  ) {
    const take = pageSize ? pageSize : 5;
    const skip = page ? page * take : 0;

    const colaboradores = await this.colaboradorProjetoRepository.find({
      where: {
        projeto: { id: projetoId },
        colaborador: { nome: Like(`%${nome}%`) },
      },
      relations: ['colaborador'],
      take: take,
      skip: skip,
    });

    return colaboradores.flatMap((colaboradorProjeto) => {
      const { senha, ...colaborador } = colaboradorProjeto.colaborador;
      return colaborador;
    });
  }

  async countUsersOnProject(projetoId: number): Promise<number> {
    return this.colaboradorProjetoRepository.count({
      where: {
        projeto: { id: projetoId },
      },
    });
  }
}
