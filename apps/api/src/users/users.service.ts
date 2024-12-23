import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../db';
import { type User, type NewUser, usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class UsersService {
  async findAll(): Promise<User[]> {
    return await db.select().from(usersTable);
  }

  async findOne(id: number): Promise<User> {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user.length) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user[0];
  }

  async create(newUser: NewUser): Promise<User> {
    const result = await db.insert(usersTable).values(newUser).returning();
    return result[0];
  }

  async update(id: number, updateData: Partial<NewUser>): Promise<User> {
    const result = await db
      .update(usersTable)
      .set(updateData)
      .where(eq(usersTable.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result[0];
  }

  async remove(id: number): Promise<User> {
    const result = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();

    if (!result.length) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return result[0];
  }
}
