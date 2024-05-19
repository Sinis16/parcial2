import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { ClubDto } from './club.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import {IsNotEmpty, IsString, IsUrl} from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('club')
@UseInterceptors(BusinessErrorsInterceptor)
export class ClubController {

    constructor(private readonly clubService: ClubService) {}

  @Get()
  async findAll() {
    return await this.clubService.findAll();
  }

  @Get(':clubId')
  async findOne(@Param('clubId') clubId: string) {
    return await this.clubService.findOne(clubId);
  }

  @Post()
  async create(@Body() ClubDto: ClubDto) {
    const museum: ClubEntity = plainToInstance(ClubEntity, ClubDto);
    return await this.clubService.create(museum);
  }

  @Put(':clubId')
  async update(@Param('clubId') clubId: string, @Body() ClubDto: ClubDto) {
    const museum: ClubEntity = plainToInstance(ClubEntity, ClubDto);
    return await this.clubService.update(clubId, museum);
  }

  @Delete(':clubId')
  @HttpCode(204)
  async delete(@Param('clubId') clubId: string) {
    return await this.clubService.delete(clubId);
  }

}
