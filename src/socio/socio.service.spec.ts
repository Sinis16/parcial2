import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config'
import { SocioEntity } from './socio.entity';
import { faker } from '@faker-js/faker';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let clubList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SocioService],
    }).compile();

    service = module.get<SocioService>(SocioService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for(let i = 0; i < 5; i++){
        const club: SocioEntity = await repository.save({
          nombre: faker.company.name(),
          fechaNacimiento: faker.date.anytime(), 
          correo: faker.lorem.sentence()})
        clubList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne should return a club by id', async () => {
    const storedClub: SocioEntity = clubList[0];
    const club: SocioEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)
    expect(club.correo).toEqual(storedClub.correo)
    expect(club.fechaNacimiento).toEqual(storedClub.fechaNacimiento)
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('create should return a new club', async () => {
    const club: SocioEntity = {
      id: "",
      nombre: faker.company.name(),
          fechaNacimiento: faker.date.anytime(), 
          correo: faker.lorem.sentence(),
      clubes: []
    }

    const newclub: SocioEntity = await service.create(club);
    expect(newclub).not.toBeNull();

    const storedClub: SocioEntity = await repository.findOne({where: {id: newclub.id}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newclub.nombre)
    expect(storedClub.correo).toEqual(newclub.correo)
    expect(storedClub.fechaNacimiento).toEqual(newclub.fechaNacimiento)
  });

  it('update should modify a club', async () => {
    const club: SocioEntity = clubList[0];
    club.nombre = "New nombre";
  
    const updatedclub: SocioEntity = await service.update(club.id, club);
    expect(updatedclub).not.toBeNull();
  
    const storedClub: SocioEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)
    expect(storedClub.fechaNacimiento).toEqual(club.fechaNacimiento)
  });
 
  it('update should throw an exception for an invalid club', async () => {
    let club: SocioEntity = clubList[0];
    club = {
      ...club, nombre: "New nombre"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('delete should remove a club', async () => {
    const club: SocioEntity = clubList[0];
    await service.delete(club.id);
  
    const deletedclub: SocioEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedclub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: SocioEntity = clubList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });
});
