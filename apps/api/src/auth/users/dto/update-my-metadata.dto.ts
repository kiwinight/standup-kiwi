import {
  IsEnum,
  IsNumber,
  IsOptional,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

class GridSettingsDto {
  @IsOptional()
  @IsEnum(['medium', 'wide', 'full'])
  width?: 'medium' | 'wide' | 'full';

  @IsOptional()
  @IsEnum(['small', 'medium', 'large'])
  cardSize?: 'small' | 'medium' | 'large';
}

class ViewSettingsDto {
  @IsOptional()
  @IsEnum(['feed', 'grid'])
  viewType?: 'feed' | 'grid';

  @IsOptional()
  @ValidateNested()
  @Type(() => GridSettingsDto)
  grid?: GridSettingsDto;
}

class BoardSettingsDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => ViewSettingsDto)
  view?: ViewSettingsDto;
}

class SettingsDto {
  @IsOptional()
  @IsEnum(['dark', 'light', 'inherit'])
  appearance?: 'dark' | 'light' | 'inherit';

  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  @Type(() => BoardSettingsDto)
  boards?: { [boardId: string]: BoardSettingsDto };
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
