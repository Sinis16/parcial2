import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClubSocioService } from './club-socio.service';
import { ClubEntity } from 'src/club/club.entity';
import { plainToInstance } from 'class-transformer';
import { ClubSocioDto } from './club-socio.dto';

@Controller('club-socio')
export class ClubSocioController {
    constructor(private readonly clubSocioService: ClubSocioService){}

    @Post(':clubId/socios/:socioId')
   async addArtworkMuseum(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.addMemberToClub(clubId, socioId);
   }

   @Get(':clubId/socios/:socioId')
   async findArtworkByclubIdsocioId(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.findMembersFromClub(clubId, socioId);
   }

   @Get(':clubId/socios')
   async findsociosByclubId(@Param('clubId') clubId: string){
       return await this.clubSocioService.findMemberFromClub(clubId);
   }
   @Put(':clubId/socios')
   async associatesociosMuseum(@Body() sociosDto: ClubSocioDto[], @Param('clubId') clubId: string){
       const socios = plainToInstance(ClubEntity, sociosDto)
       return await this.clubSocioService.updateMembersFromClub(clubId, socios);
   }

   @Delete(':clubId/socios/:socioId')
    @HttpCode(204)
   async deleteArtworkMuseum(@Param('clubId') clubId: string, @Param('socioId') socioId: string){
       return await this.clubSocioService.deleteMemberFromClub(clubId, socioId);
   }

}
