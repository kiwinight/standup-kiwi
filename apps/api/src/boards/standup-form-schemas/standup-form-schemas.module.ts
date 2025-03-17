import { Module } from '@nestjs/common';
import { StandupFormSchemasService } from './standup-form-schemas.service';
import { StandupFormSchemasController } from './standup-form-schemas.controller';
import { DbModule } from 'src/db/db.module';
@Module({
  controllers: [StandupFormSchemasController],
  providers: [StandupFormSchemasService],
  imports: [DbModule],
})
export class StandupFormSchemasModule {}
