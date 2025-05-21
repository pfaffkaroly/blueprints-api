import { Test, TestingModule } from '@nestjs/testing';
import { BlueprintsController } from './blueprints.controller';
import { BlueprintsService } from './blueprints.service';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('BlueprintsController', () => {
  let controller: BlueprintsController;
  let service: BlueprintsService;

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BlueprintsController],
      providers: [
        {
          provide: BlueprintsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<BlueprintsController>(BlueprintsController);
    service = module.get<BlueprintsService>(BlueprintsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create blueprint', async () => {
    const dto = { name: 'test', version: '1.0.0', author: 'a', data: {} };
    mockService.create.mockResolvedValue({ id: 1, ...dto });

    const result = await controller.create(dto);
    expect(result).toEqual({ id: 1, ...dto });
  });

  it('should handle error during create', async () => {
    mockService.create.mockRejectedValue(new InternalServerErrorException());
    await expect(controller.create({ name: '', version: '', author: '', data: {} })).rejects.toThrow(InternalServerErrorException);
  });

  it('should get all blueprints', async () => {
    const items = [{ id: 1, name: 'a', version: '1.0.0', author: 'x', blueprint_data: {} }];
    mockService.findAll.mockResolvedValue(items);

    const result = await controller.findAll({});
    expect(result).toEqual(items);
  });

  it('should handle error during findAll', async () => {
    mockService.findAll.mockRejectedValue(new InternalServerErrorException());
    await expect(controller.findAll({})).rejects.toThrow(InternalServerErrorException);
  });

  it('should get one blueprint', async () => {
    const item = { id: 1, name: 'a', version: '1.0.0', author: 'x', blueprint_data: {} };
    mockService.findOne.mockResolvedValue(item);

    const result = await controller.findOne('1');
    expect(result).toEqual(item);
  });

  it('should handle not found during findOne', async () => {
    mockService.findOne.mockRejectedValue(new NotFoundException());
    await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
  });

  it('should update blueprint', async () => {
    const dto = { name: 'updated' };
    const updated = { id: 1, name: 'updated' };
    mockService.update.mockResolvedValue(updated);

    const result = await controller.update('1', dto);
    expect(result).toEqual(updated);
  });

  it('should handle not found during update', async () => {
    mockService.update.mockRejectedValue(new NotFoundException());
    await expect(controller.update('1', {})).rejects.toThrow(NotFoundException);
  });

  it('should delete blueprint', async () => {
    mockService.remove.mockResolvedValue({ deleted: true });

    const result = await controller.remove('1');
    expect(result).toEqual({ deleted: true });
  });

  it('should handle not found during delete', async () => {
    mockService.remove.mockRejectedValue(new NotFoundException());
    await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
  });
});
