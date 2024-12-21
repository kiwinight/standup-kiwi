import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { db } from '../db';
import { tasks } from '../db/schema';
import type { NewTask } from '../db/schema';
import { eq } from 'drizzle-orm';

@Controller('tasks')
export class TasksController {
  @Get()
  async findAll() {
    return await db.select().from(tasks);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .limit(1);
  }

  @Post()
  async create(@Body() taskData: NewTask) {
    return await db.insert(tasks).values(taskData).returning();
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() taskData: Partial<NewTask>) {
    return await db
      .update(tasks)
      .set({ ...taskData, updatedAt: new Date() })
      .where(eq(tasks.id, parseInt(id)))
      .returning();
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await db
      .delete(tasks)
      .where(eq(tasks.id, parseInt(id)))
      .returning();
  }
}
