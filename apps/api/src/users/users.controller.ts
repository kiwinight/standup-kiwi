import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import type { NewUser, User } from '../db/schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(Number(id));
  }

  @Post()
  create(@Body() newUser: NewUser): Promise<User> {
    return this.usersService.create(newUser);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<NewUser>,
  ): Promise<User> {
    return this.usersService.update(Number(id), updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.usersService.remove(Number(id));
  }
}
