import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  boolean,
} from 'drizzle-orm/pg-core';

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  isCompleted: boolean('is_completed').default(false).notNull(),
  dueDate: timestamp('due_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Export types for better type inference
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
