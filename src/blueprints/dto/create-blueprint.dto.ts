import {
  IsString,
  IsNotEmpty,
  IsObject,
  MaxLength,
  Matches,
  IsEmail,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBlueprintDto {
  @ApiProperty({ example: 'aws_neptune' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: '1.1.0' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+\.\d+\.\d+$/, { message: 'Version must be in x.y.z format' })
  version: string;

  @ApiProperty({ example: 'bluebricks@example.com' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  author: string;

  @ApiProperty({
    example: {
      packages: ['aws', 'neptune'],
      props: { region: 'us-east-1' },
      outs: ['endpoint'],
    },
  })
  @IsObject()
  data: Record<string, any>;
}
