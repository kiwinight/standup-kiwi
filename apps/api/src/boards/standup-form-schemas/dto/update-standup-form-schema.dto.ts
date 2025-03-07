import { PartialType } from '@nestjs/mapped-types';
import { CreateStandupFormSchemaDto } from './create-standup-form-schema.dto';

export class UpdateStandupFormSchemaDto extends PartialType(
  CreateStandupFormSchemaDto,
) {}
