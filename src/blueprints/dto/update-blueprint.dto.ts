import { PartialType } from '@nestjs/swagger';
import { CreateBlueprintDto } from './create-blueprint.dto';

export class UpdateBlueprintDto extends PartialType(CreateBlueprintDto) {}
