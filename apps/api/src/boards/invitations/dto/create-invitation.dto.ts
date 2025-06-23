import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';

export class CreateInvitationDto {
  @IsEnum(['admin', 'collaborator'])
  role!: 'admin' | 'collaborator';

  @IsOptional()
  @IsString()
  @Matches(/^\d+[hdwm]$/, {
    message: 'expiresIn must be in format like "1h", "24h", "7d", "30d"',
  })
  expiresIn?: string;
}

export class UpdateInvitationExpirationDto {
  @IsString()
  @Matches(/^\d+[hdwm]$/, {
    message: 'expiresIn must be in format like "1h", "24h", "7d", "30d"',
  })
  expiresIn!: string;
}
