import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class RegenerateInvitationDto {
  @IsEnum(['admin', 'collaborator'])
  role!: 'admin' | 'collaborator';

  @IsString()
  @Matches(/^\d+[hdwm]$/, {
    message: 'expiresIn must be in format like "1h", "24h", "7d", "30d"',
  })
  expiresIn!: string;
}
