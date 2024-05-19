import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { ClubSocioModule } from './club-socio/club-socio.module';
import { MuseumController } from './museum/museum.controller';
import { ClubMeController } from './cayppprk/club-me/club-me.controller';
import { ClubSocialController } from './club-social/club-social.controller';

@Module({
  imports: [SocioModule, ClubModule, ClubSocioModule],
  controllers: [AppController, MuseumController, ClubMeController, ClubSocialController],
  providers: [AppService],
})
export class AppModule {}
