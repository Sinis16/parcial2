import { Test, TestingModule } from '@nestjs/testing';
import { SocioService } from './socio.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { SocioEntity } from './socio.entity';
import { faker } from '@faker-js/faker';
import { BusinessError } from '../shared/errors/business-errors';

describe('SocioService', () => {
  let service: SocioService;
  let repository: Repository<SocioEntity>;
  let socioList: SocioEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [
        SocioService,
        {
          provide: getRepositoryToken(SocioEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SocioService>(SocioService);
    repository = module.get<Repository<SocioEntity>>(getRepositoryToken(SocioEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    await repository.clear();
    socioList = [];
    for (let i = 0; i < 5; i++) {
      const socio: SocioEntity = await repository.save({
        nombre: faker.company.name(),
        fechaNacimiento: faker.date.past(),
        correo: faker.internet.email(),
      });
      socioList.push(socio);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne should return a socio by id', async () => {
    const storedsocio: SocioEntity = socioList[1];
    const socio: SocioEntity = await service.findOne(storedsocio.id);
    expect(socio).not.toBeNull();
    expect(socio.nombre).toEqual(storedsocio.nombre);
    expect(socio.correo).toEqual(storedsocio.correo);
    expect(socio.fechaNacimiento).toEqual(storedsocio.fechaNacimiento);
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The socio with the given id was not found',
    );
  });

  it('create should return a new socio', async () => {
    const socio: SocioEntity = {
      id: '',
      nombre: faker.company.name(),
      fechaNacimiento: faker.date.past(),
      correo: 'correao@domain.com',
      clubes: [],
    };

    const newsocio: SocioEntity = await service.create(socio);
    expect(newsocio).not.toBeNull();

    const storedsocio: SocioEntity = await repository.findOne({ where: { id: newsocio.id } });
    expect(storedsocio).not.toBeNull();
    expect(storedsocio.nombre).toEqual(newsocio.nombre);
    expect(storedsocio.correo).toEqual(newsocio.correo);
    expect(storedsocio.fechaNacimiento).toEqual(newsocio.fechaNacimiento);
  });

  it('update should modify a socio', async () => {
    const socio: SocioEntity = socioList[1];
    socio.nombre = 'New nombre';

    const updatedsocio: SocioEntity = await service.update(socio.id, socio);
    expect(updatedsocio).not.toBeNull();

    const storedsocio: SocioEntity = await repository.findOne({ where: { id: socio.id } });
    expect(storedsocio).not.toBeNull();
    expect(storedsocio.nombre).toEqual(socio.nombre);
    expect(storedsocio.fechaNacimiento).toEqual(socio.fechaNacimiento);
  });

  it('update should throw an exception for an invalid socio', async () => {
    let socio: SocioEntity = socioList[1];
    socio = {
      ...socio,
      nombre: 'New nombre',
    };
    await expect(service.update('0', socio)).rejects.toHaveProperty(
      'message',
      'The socio with the given id was not found',
    );
  });

  it('delete should remove a socio', async () => {
    const socio: SocioEntity = socioList[1];
    await service.delete(socio.id);

    const deletedsocio: SocioEntity = await repository.findOne({ where: { id: socio.id } });
    expect(deletedsocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    await expect(service.delete('0')).rejects.toHaveProperty(
      'message',
      'The socio with the given id was not found',
    );
  });
});
