import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlueprintsService } from './blueprints.service';
import { Blueprint } from './entities/blueprint.entity';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('BlueprintsService', () => {
  let service: BlueprintsService;
  let repo: Repository<Blueprint>;

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlueprintsService,
        {
          provide: getRepositoryToken(Blueprint),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<BlueprintsService>(BlueprintsService);
    repo = module.get<Repository<Blueprint>>(getRepositoryToken(Blueprint));
  });

  afterEach(() => jest.clearAllMocks());

  it('should create a blueprint', async () => {
    const dto = { name: 'test', version: '1.0', author: 'test@example.com', data: {} };
    const created = { id: 1, ...dto };
    mockRepo.create.mockReturnValue(dto);
    mockRepo.save.mockResolvedValue(created);

    const result = await service.create(dto);
    expect(result).toEqual(created);
  });

  it('should handle errors during create', async () => {
    mockRepo.create.mockReturnValue({});
    mockRepo.save.mockRejectedValue(new Error('DB error'));
    await expect(service.create({ name: '', version: '', author: '', data: {} })).rejects.toThrow(InternalServerErrorException);
  });

  it('should return all blueprints', async () => {
    const data = [{ id: 1 }];
    mockRepo.find.mockResolvedValue(data);
    const result = await service.findAll({});
    expect(result).toEqual(data);
  });

  it('should handle errors during findAll', async () => {
    mockRepo.find.mockRejectedValue(new Error('DB error'));
    await expect(service.findAll({})).rejects.toThrow(InternalServerErrorException);
  });

  it('should return one blueprint', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1 });
    const result = await service.findOne(1);
    expect(result).toEqual({ id: 1 });
  });

  it('should throw NotFound if blueprint not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
  });

  it('should handle errors during findOne', async () => {
    mockRepo.findOneBy.mockRejectedValue(new Error('fail'));
    await expect(service.findOne(1)).rejects.toThrow(InternalServerErrorException);
  });

  it('should update a blueprint', async () => {
    mockRepo.update.mockResolvedValue({ affected: 1 });
    mockRepo.findOneBy.mockResolvedValue({ id: 1 });
    const result = await service.update(1, {});
    expect(result).toEqual({ id: 1 });
  });

  it('should throw NotFound on update if affected is 0', async () => {
    mockRepo.update.mockResolvedValue({ affected: 0 });
    await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
  });

  it('should handle errors during update', async () => {
    mockRepo.update.mockRejectedValue(new Error('fail'));
    await expect(service.update(1, {})).rejects.toThrow(InternalServerErrorException);
  });

  it('should delete a blueprint', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 1 });
    const result = await service.remove(1);
    expect(result).toEqual({ deleted: true });
  });

  it('should throw NotFound on delete if affected is 0', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 0 });
    await expect(service.remove(1)).rejects.toThrow(NotFoundException);
  });

  it('should handle errors during delete', async () => {
    mockRepo.delete.mockRejectedValue(new Error('fail'));
    await expect(service.remove(1)).rejects.toThrow(InternalServerErrorException);
  });
});