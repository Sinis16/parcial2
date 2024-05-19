import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ClubSocioService } from './club-socio.service';
import { SocioEntity } from '../socio/socio.entity';
import { ClubEntity } from '../club/club.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { faker } from '@faker-js/faker';

describe('ClubSocioService', () => {
  let service: ClubSocioService;
  let clubRepository: Repository<ClubEntity>;
  let socioRepository: Repository<SocioEntity>;
  let club: ClubEntity;
  let sociosList : SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubSocioService],
    }).compile();

    service = module.get<ClubSocioService>(ClubSocioService);
  });

  const seedDatabase = async () => {
    clubRepository.clear();
    socioRepository.clear();

    sociosList = [];
    for(let i = 0; i < 5; i++){
        const socio: SocioEntity = await socioRepository.save({
          nombre: faker.company.name(),
          correo: faker.internet.email(),
          fechaNacimiento: faker.date.anytime(), 
        })
        sociosList.push(socio);
    }
 
    club = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.anytime(), 
      imagen: faker.image.image(),
      descripcion: faker.lorem.sentence(),
      socios: sociosList
    })
  }

  it('addMemberToClub should add an socio to a club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.anytime(), 
    });
 
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.anytime(), 
      imagen: faker.image.image(),
      descripcion: faker.lorem.sentence(),
    })
 
    const result: ClubEntity = await service.addMemberToClub(newClub.id, newSocio.id);
   
    expect(result.socios.length).toBe(1);
    expect(result.socios[0]).not.toBeNull();
    expect(result.socios[0].nombre).toBe(newSocio.nombre)
    expect(result.socios[0].correo).toBe(newSocio.correo)
    expect(result.socios[0].fechaNacimiento).toBe(newSocio.fechaNacimiento)
  });

  it('addsocioclub should thrown exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.anytime(), 
      imagen: faker.image.image(),
      descripcion: faker.lorem.sentence(),
    })
 
    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });
  it('addsocioclub should thrown exception for an invalid socio', async () => {
    const newClub: ClubEntity = await clubRepository.save({
      nombre: faker.company.name(),
      fechaFundacion: faker.date.anytime(), 
      imagen: faker.image.image(),
      descripcion: faker.lorem.sentence(),
    })
 
    await expect(() => service.addMemberToClub(newClub.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });


  it('addsocioclub should throw an exception for an invalid club', async () => {
    const newSocio: SocioEntity = await socioRepository.save({
      nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.anytime(), 
    });
 
    await expect(() => service.addMemberToClub("0", newSocio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
  });
  
it('findsocioByclubIdsocioId should return socio by club', async () => {
  const socio: SocioEntity = sociosList[0];
  const storedSocio: SocioEntity = await service.findMemberFromClub(club.id, socio.id, )
  expect(storedSocio).not.toBeNull();
  expect(storedSocio.nombre).toBe(socio.nombre);
  expect(storedSocio.correo).toBe(socio.correo);
});

it('findsocioByclubIdsocioId should throw an exception for an invalid socio', async () => {
  await expect(()=> service.findMemberFromClub(club.id, "0")).rejects.toHaveProperty("message", "The socio with the given id was not found");
});

it('findsocioByclubIdsocioId should throw an exception for an invalid club', async () => {
  const socio: SocioEntity = sociosList[0];
  await expect(()=> service.findMemberFromClub("0", socio.id)).rejects.toHaveProperty("message", "The club with the given id was not found");
});

it('findsocioByclubIdsocioId should throw an exception for an socio not associated to the club', async () => {
  const newSocio: SocioEntity = await socioRepository.save({
    nombre: faker.company.name(),
      correo: faker.internet.email(),
      fechaNacimiento: faker.date.anytime(), 
  });

  await expect(()=> service.findMemberFromClub(club.id, newSocio.id)).rejects.toHaveProperty("message", "The socio with the given id is not associated to the club");
});

it('findsociosByclubId should return socios by club', async ()=>{
  const socios: SocioEntity[] = await service.findMembersFromClub(club.id);
  expect(socios.length).toBe(5)
});

it('findsociosByclubId should throw an exception for an invalid club', async () => {
  await expect(()=> service.findMembersFromClub("0")).rejects.toHaveProperty("message", "The club with the given id was not found");
});

it('associatesociosclub should update socios list for a club', async () => {
  const newSocio: SocioEntity = await socioRepository.save({
    nombre: faker.company.name(),
    correo: faker.internet.email(),
    fechaNacimiento: faker.date.anytime(), 
  });

  


  const updatedclub: ClubEntity = await service.updateMembersFromClub(club.id, [newSocio]);
  expect(updatedclub.socios.length).toBe(1);

  expect(updatedclub.socios[0].nombre).toBe(newSocio.nombre);
  expect(updatedclub.socios[0].correo).toBe(newSocio.correo); 
});

  it('associatesociosclub should throw an exception for an invalid socio', async () => {
    const newSocio: SocioEntity = sociosList[0];
    newSocio.id = "0";
  
    await expect(()=> service.updateMembersFromClub(club.id, [newSocio])).rejects.toHaveProperty("message", "The socio with the given id was not found");
  });
  

});
