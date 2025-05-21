import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlueprintsService } from './blueprints.service';
import { BlueprintsController } from './blueprints.controller';
import { Blueprint } from './entities/blueprint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Blueprint])],
  providers: [BlueprintsService],
  controllers: [BlueprintsController]
})
export class BlueprintsModule {}
