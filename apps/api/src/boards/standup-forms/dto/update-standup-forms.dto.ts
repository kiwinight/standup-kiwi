import { PartialType } from '@nestjs/mapped-types';
import { CreateStandupFormDto } from './create-standup-form.dto';

export class UpdateStandupFormsDto extends PartialType(CreateStandupFormDto) {}
