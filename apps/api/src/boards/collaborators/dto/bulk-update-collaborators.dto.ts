import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateCollaboratorDto } from './update-collaborator.dto';

export class CollaboratorUpdateItem extends UpdateCollaboratorDto {
  @IsString()
  userId!: string;
}

export class BulkUpdateCollaboratorsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CollaboratorUpdateItem)
  collaborators!: CollaboratorUpdateItem[];
}
