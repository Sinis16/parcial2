import { Module } from '@nestjs/common';
import { ClubService } from './club.service';
import { ClubController } from './club.controller';
import { Controller, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { MuseumArtworkService } from './museum-artwork.service';

@Module({
  providers: [ClubService],
  controllers: [ClubController]
})
export class ClubModule {}
