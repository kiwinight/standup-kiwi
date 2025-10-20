import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateStandupFormDto {
  @IsNotEmpty()
  @IsObject()
  schema!: object;
}