import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config'
import { ClubService } from './club.service';
import { ClubEntity } from './club.entity';
import { faker } from '@faker-js/faker';

describe('ClubService', () => {
  let service: ClubService;
  let repository: Repository<ClubEntity>;
  let clubList: ClubEntity[];
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubService],
    }).compile();

    service = module.get<ClubService>(ClubService);
    repository = module.get<Repository<ClubEntity>>(getRepositoryToken(ClubEntity));
    await seedDatabase();
  });

  

  const seedDatabase = async () => {
    repository.clear();
    clubList = [];
    for(let i = 0; i < 5; i++){
        const club: ClubEntity = await repository.save({
          nombre: faker.company.name(),
          fechaFundacion: faker.date.anytime(), 
          imagen: faker.image.url(),
          descripcion: faker.lorem.sentence()})
        clubList.push(club);
    }
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne should return a club by id', async () => {
    const storedClub: ClubEntity = clubList[0];
    const club: ClubEntity = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.nombre).toEqual(storedClub.nombre)
    expect(club.descripcion).toEqual(storedClub.descripcion)
    expect(club.fechaFundacion).toEqual(storedClub.fechaFundacion)
    expect(club.imagen).toEqual(storedClub.imagen)
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('create should return a new club', async () => {
    const club: ClubEntity = {
      id: "",
      nombre: faker.company.name(),
          fechaFundacion: faker.date.anytime(), 
          imagen: faker.image.url(),
          descripcion: faker.lorem.sentence(),
      socios: []
    }

    const newclub: ClubEntity = await service.create(club);
    expect(newclub).not.toBeNull();

    const storedClub: ClubEntity = await repository.findOne({where: {id: newclub.id}})
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(newclub.nombre)
    expect(storedClub.descripcion).toEqual(newclub.descripcion)
    expect(storedClub.fechaFundacion).toEqual(newclub.fechaFundacion)
    expect(storedClub.imagen).toEqual(newclub.imagen)
  });

  it('update should modify a club', async () => {
    const club: ClubEntity = clubList[0];
    club.nombre = "New nombre";
  
    const updatedclub: ClubEntity = await service.update(club.id, club);
    expect(updatedclub).not.toBeNull();
  
    const storedClub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(storedClub).not.toBeNull();
    expect(storedClub.nombre).toEqual(club.nombre)
    expect(storedClub.fechaFundacion).toEqual(club.fechaFundacion)
  });
 
  it('update should throw an exception for an invalid club', async () => {
    let club: ClubEntity = clubList[0];
    club = {
      ...club, nombre: "New nombre"
    }
    await expect(() => service.update("0", club)).rejects.toHaveProperty("message", "The club with the given id was not found")
  });

  it('delete should remove a club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
  
    const deletedclub: ClubEntity = await repository.findOne({ where: { id: club.id } })
    expect(deletedclub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    const club: ClubEntity = clubList[0];
    await service.delete(club.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "The club with the given id was not found")
  });


});
