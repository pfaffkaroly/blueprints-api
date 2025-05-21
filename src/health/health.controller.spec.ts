import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheckResult,
} from '@nestjs/terminus';

describe('HealthController', () => {
  let controller: HealthController;
  let health: HealthCheckService;
  let db: TypeOrmHealthIndicator;
  let disk: DiskHealthIndicator;
  let memory: MemoryHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HealthCheckService,
          useValue: {
            check: jest.fn(),
          },
        },
        {
          provide: TypeOrmHealthIndicator,
          useValue: {
            pingCheck: jest.fn(),
          },
        },
        {
          provide: DiskHealthIndicator,
          useValue: {
            checkStorage: jest.fn(),
          },
        },
        {
          provide: MemoryHealthIndicator,
          useValue: {
            checkHeap: jest.fn(),
            checkRSS: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    health = module.get<HealthCheckService>(HealthCheckService);
    db = module.get<TypeOrmHealthIndicator>(TypeOrmHealthIndicator);
    disk = module.get<DiskHealthIndicator>(DiskHealthIndicator);
    memory = module.get<MemoryHealthIndicator>(MemoryHealthIndicator);
  });

  it('should return liveness status', () => {
    expect(controller.liveCheck()).toEqual({ status: 'ok' });
  });

  it('should call health.check() for /health', async () => {
    const mockResult = {
      status: 'ok',
      info: { 
        database: { status: 'up' } 
      },
      error: {},
      details: { 
        database: { status: 'up' } 
      },
    } as HealthCheckResult;
    const checkMock = jest.spyOn(health, 'check').mockResolvedValue(mockResult);
    const result = await controller.check();
    expect(checkMock).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });

  it('should call health.check() for /health/ready', async () => {
    const mockResult = { 
      status: 'ok', 
      info: { 
        database: { status: 'up' }, 
        disk: { status: 'up' }, 
        memory_heap: { status: 'up' }, 
        memory_rss: { status: 'up' } 
      }, 
      error: {}, 
      details: { 
        database: { status: 'up' }, 
        disk: { status: 'up' }, 
        memory_heap: { status: 'up' }, 
        memory_rss: { status: 'up' } 
      } 
    } as HealthCheckResult;
    const checkMock = jest.spyOn(health, 'check').mockResolvedValue(mockResult);
    const result = await controller.readinessCheck();
    expect(checkMock).toHaveBeenCalled();
    expect(result).toEqual(mockResult);
  });
});