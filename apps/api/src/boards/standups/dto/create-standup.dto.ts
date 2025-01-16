import { IsObject, IsNotEmpty } from 'class-validator';

export class CreateStandupDto {
  @IsNotEmpty()
  @IsObject()
  formData: unknown;
}
