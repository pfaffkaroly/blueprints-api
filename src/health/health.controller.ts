import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  TypeOrmHealthIndicator,
  DiskHealthIndicator,
  MemoryHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private disk: DiskHealthIndicator,
    private memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiResponse({ status: 200, description: 'Application and DB are healthy.' })
  @ApiResponse({ status: 503, description: 'Service unavailable or unhealthy.' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }

  @Get('live')
  @ApiResponse({ status: 200, description: 'Application is alive.' })
  liveCheck() {
    return { status: 'ok' };
  }

  @Get('ready')
  @HealthCheck()
  @ApiResponse({ status: 200, description: 'Application is ready to receive traffic.' })
  @ApiResponse({ status: 503, description: 'Application is not ready (disk/memory/DB issues).' })
  readinessCheck() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.disk.checkStorage('disk', {
        path: process.platform === 'win32' ? 'C:\\' : '/',
        thresholdPercent: 0.9,
      }),
      () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024), // 300MB
      () => this.memory.checkRSS('memory_rss', 400 * 1024 * 1024),   // 400MB
    ]);
  }
}
