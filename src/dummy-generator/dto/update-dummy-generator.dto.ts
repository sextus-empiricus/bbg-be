import { PartialType } from '@nestjs/mapped-types';
import { CreateDummyGeneratorDto } from './create-dummy-generator.dto';

export class UpdateDummyGeneratorDto extends PartialType(CreateDummyGeneratorDto) {}
