import { IsEnum } from 'class-validator';

export class UpdateCollaboratorDto {
  @IsEnum(['admin', 'collaborator'])
  role!: 'admin' | 'collaborator';
}
