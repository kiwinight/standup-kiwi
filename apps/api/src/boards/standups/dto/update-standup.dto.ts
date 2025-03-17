import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateStandupDto } from './create-standup.dto';

export class UpdateStandupDto extends PartialType(
  OmitType(CreateStandupDto, ['formStructureId'] as const),
) {}
