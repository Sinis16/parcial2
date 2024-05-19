import { Injectable } from '@nestjs/common';
import { SocioEntity } from './socio.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class SocioService {

  constructor(
    @InjectRepository(SocioEntity)
    private readonly socioRepository: Repository<SocioEntity>
  ) {}

  async create(socio: SocioEntity): Promise<SocioEntity> {
    if (!socio.correo.includes('@')) {
      throw new BusinessLogicException("The socio doesn't have a valid email", BusinessError.BAD_REQUEST);
    }
    return await this.socioRepository.save(socio);
  }

  async findAll(): Promise<SocioEntity[]> {
    return await this.socioRepository.find({ relations: ["socios"] });
  }

  async findOne(id: string): Promise<SocioEntity> {
    const socio: SocioEntity = await this.socioRepository.findOne({ where: { id }, relations: ["socios"] });
    if (!socio) {
      throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
    }
    return socio;
  }

  async update(id: string, socio: SocioEntity): Promise<SocioEntity> {
    const persistedSocio: SocioEntity = await this.socioRepository.findOne({ where: { id } });
    if (!persistedSocio) {
      throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
    }
    if (!socio.correo.includes('@')) {
      throw new BusinessLogicException("The socio doesn't have a valid email", BusinessError.BAD_REQUEST);
    }
    return await this.socioRepository.save({ ...persistedSocio, ...socio });
  }

  async delete(id: string): Promise<void> {
    const socio: SocioEntity = await this.socioRepository.findOne({ where: { id } });
    if (!socio) {
      throw new BusinessLogicException("The socio with the given id was not found", BusinessError.NOT_FOUND);
    }
    await this.socioRepository.remove(socio);
  }
}
