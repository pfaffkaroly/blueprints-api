import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { BlueprintsService } from './blueprints.service';
import { FilterBlueprintsDto } from './dto/filter-blueprints.dto';
import { CreateBlueprintDto } from './dto/create-blueprint.dto';
import { UpdateBlueprintDto } from './dto/update-blueprint.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Blueprint } from './entities/blueprint.entity';

@ApiTags('Blueprints')
@Controller('blueprints')
export class BlueprintsController {
  constructor(private readonly service: BlueprintsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blueprint' })
  @ApiResponse({ status: 201, description: 'Blueprint created successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async create(@Body() createDto: CreateBlueprintDto): Promise<Blueprint> {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all blueprints with optional filters' })
  @ApiResponse({ status: 200, description: 'Blueprints retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findAll(@Query() filterDto: FilterBlueprintsDto): Promise<Blueprint[]> {
    return this.service.findAll(filterDto);
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Blueprint retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Blueprint not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async findOne(@Param('id') id: string): Promise<Blueprint> {
    return this.service.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a blueprint by ID' })
  @ApiResponse({ status: 200, description: 'Blueprint updated successfully.' })
  @ApiResponse({ status: 404, description: 'Blueprint not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateBlueprintDto): Promise<Blueprint | null> {
    return this.service.update(+id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a blueprint by ID' })
  @ApiResponse({ status: 200, description: 'Blueprint deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Blueprint not found.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.service.remove(+id);
  }
}
