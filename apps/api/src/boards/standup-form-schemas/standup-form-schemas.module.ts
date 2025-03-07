import { Module } from '@nestjs/common';
import { StandupFormSchemasService } from './standup-form-schemas.service';
import { StandupFormSchemasController } from './standup-form-schemas.controller';

@Module({
  controllers: [StandupFormSchemasController],
  providers: [StandupFormSchemasService],
})
export class StandupFormSchemasModule {}
