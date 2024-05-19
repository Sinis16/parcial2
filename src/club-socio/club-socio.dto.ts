import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
import { Repository } from 'typeorm';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';

export class ClubSocioDto {
@IsNotEmpty()
 readonly clubRepository: Repository<ClubEntity>;
 
 @IsNotEmpty()
 readonly socioRepository: Repository<SocioEntity>;

}
