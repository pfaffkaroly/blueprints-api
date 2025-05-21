import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Blueprint } from './entities/blueprint.entity';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { FilterBlueprintsDto } from './dto/filter-blueprints.dto';

@Injectable()
export class BlueprintsService {
  private readonly logger = new Logger(BlueprintsService.name);

  constructor(
    @InjectRepository(Blueprint)
    private blueprintRepo: Repository<Blueprint>,
  ) {}

  async create(createDto: CreateBlueprintDto): Promise<Blueprint> {
    try {
      const blueprint = this.blueprintRepo.create(createDto);
      const result = await this.blueprintRepo.save(blueprint);
      this.logger.log(`Created blueprint with ID ${result.id}`);
      return result;
    } catch (error) {
      this.logger.error('Failed to create blueprint', error.stack);
      throw new InternalServerErrorException('Failed to create blueprint');
    }
  }

  async findAll(filterDto: FilterBlueprintsDto): Promise<Blueprint[]> {
    try {
      const where: any = {};

      if (filterDto.name) {
        where.name = Like(`%${filterDto.name}%`);
      }
      if (filterDto.version) {
        where.version = filterDto.version;
      }
      if (filterDto.author) {
        where.author = Like(`%${filterDto.author}%`);
      }

      const results = await this.blueprintRepo.find({ where });
      this.logger.log(`Retrieved ${results.length} blueprint(s)`);
      return results;
    } catch (error) {
      this.logger.error('Failed to fetch blueprints', error.stack);
      throw new InternalServerErrorException('Failed to fetch blueprints');
    }
  }

  async findOne(id: number): Promise<Blueprint> {
    try {
      const blueprint = await this.blueprintRepo.findOneBy({ id });
      if (!blueprint) {
        this.logger.warn(`Blueprint with ID ${id} not found`);
        throw new NotFoundException(`Blueprint with ID ${id} not found`);
      }
      this.logger.log(`Retrieved blueprint with ID ${id}`);
      return blueprint;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to retrieve blueprint with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to retrieve blueprint');
    }
  }

  async update(id: number, updateDto: UpdateBlueprintDto): Promise<Blueprint | null> {
    try {
      const updateResult = await this.blueprintRepo.update(id, updateDto);
      if (updateResult.affected === 0) {
        this.logger.warn(`Blueprint with ID ${id} not found for update`);
        throw new NotFoundException(`Blueprint with ID ${id} not found`);
      }
      this.logger.log(`Updated blueprint with ID ${id}`);
      return await this.blueprintRepo.findOneBy({ id });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update blueprint with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update blueprint');
    }
  }

  async remove(id: number): Promise<{ deleted: boolean }> {
    try {
      const deleteResult = await this.blueprintRepo.delete(id);
      if (deleteResult.affected === 0) {
        this.logger.warn(`Blueprint with ID ${id} not found for deletion`);
        throw new NotFoundException(`Blueprint with ID ${id} not found`);
      }
      this.logger.log(`Deleted blueprint with ID ${id}`);
      return { deleted: true };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete blueprint with ID ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete blueprint');
    }
  }
}
