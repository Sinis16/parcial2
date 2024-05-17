import { Injectable } from '@nestjs/common';
import { ClubEntity } from './club.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ClubService {

    //Constructor
    constructor(
        @InjectRepository(ClubEntity)
        private readonly clubRepository: Repository<ClubEntity>
    ){}

    async create(club: ClubEntity): Promise<ClubEntity>{
        if (club.descripcion.length > 100)
            throw new BusinessLogicException("The club's description surpasses the character limit", BusinessError.BAD_REQUEST)
        return await this.clubRepository.save(club);
    }

    async findAll(): Promise<ClubEntity[]> {
        return await this.clubRepository.find({ relations: ["socios"] });
    }

    async findOne(id: string): Promise<ClubEntity> {
        const club: ClubEntity = await this.clubRepository.findOne({where: {id}, relations: ["artworks", "exhibitions"] } );
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
   
        return club;
    }

    async update(id: string, club: ClubEntity): Promise<ClubEntity> {
        const persistedClub: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!persistedClub)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
        if (club.descripcion.length > 100)
            throw new BusinessLogicException("The club's description surpasses the character limit", BusinessError.BAD_REQUEST)
        return await this.clubRepository.save({...persistedClub, ...club});
    }

    async delete(id: string) {
        const club: ClubEntity = await this.clubRepository.findOne({where:{id}});
        if (!club)
          throw new BusinessLogicException("The club with the given id was not found", BusinessError.NOT_FOUND);
     
        await this.clubRepository.remove(club);
    }
}
