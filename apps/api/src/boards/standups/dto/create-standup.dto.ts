import { IsObject, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateStandupDto {
  @IsNotEmpty()
  @IsObject()
  formData: unknown;

  @IsNotEmpty()
  @IsNumber()
  formSchemaId: number;
}
