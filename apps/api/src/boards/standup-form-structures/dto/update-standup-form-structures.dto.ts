import { PartialType } from '@nestjs/mapped-types';
import { CreateStandupFormStructureDto } from './create-standup-form-structure.dto';

export class UpdateStandupFormStructureDto extends PartialType(
  CreateStandupFormStructureDto,
) {}
