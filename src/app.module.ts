import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocioModule } from './socio/socio.module';
import { ClubModule } from './club/club.module';
import { ClubSocioModule } from './club-socio/club-socio.module';
import { ClubController } from './club/club.controller';
import { SocioController } from './socio/socio.controller';
import { ClubSocioController } from './club-socio/club-socio.controller';
import { ClubEntity } from './club/club.entity';
import { SocioEntity } from './socio/socio.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  
  imports: [SocioModule, ClubModule, ClubSocioModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'museum',
      entities: [ClubEntity, SocioEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    }),
    ClubSocioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
