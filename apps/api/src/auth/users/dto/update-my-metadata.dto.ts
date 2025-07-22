import { IsEnum, IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class SettingsDto {
  @IsOptional()
  @IsEnum(['dark', 'light', 'inherit'])
  appearance?: 'dark' | 'light' | 'inherit';
}

export class UpdateMyMetadataDto {
  @IsOptional()
  @IsNumber()
  lastAccessedBoardId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => SettingsDto)
  settings?: SettingsDto;
}
