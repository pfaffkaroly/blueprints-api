import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterBlueprintsDto {
  @ApiPropertyOptional({ example: 'aws', description: 'Filter by name (partial match)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: '1.1', description: 'Filter by version (exact match)' })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({ example: 'bluebricks', description: 'Filter by author (partial match)' })
  @IsOptional()
  @IsString()
  author?: string;
}
