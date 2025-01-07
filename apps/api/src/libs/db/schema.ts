import { relations } from 'drizzle-orm';
import {
  integer,
  pgTable,
  text,
  uuid,
  timestamp,
  serial,
  primaryKey,
  jsonb,
} from 'drizzle-orm/pg-core';

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  formSchemas: jsonb('form_schemas').notNull(),
  name: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const boardsRelations = relations(boards, ({ many }) => ({
  usersToBoards: many(usersToBoards),
}));

export const usersToBoards = pgTable(
  'users_to_boards',
  {
    userId: uuid('user_id').notNull(), // User from another auth service
    boardId: integer('board_id')
      .notNull()
      .references(() => boards.id),
    // TODO: add role - admin, member
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.boardId] }),
  }),
);

export const usersToBoardsRelations = relations(usersToBoards, ({ one }) => ({
  board: one(boards, {
    fields: [usersToBoards.boardId],
    references: [boards.id],
  }),
}));

export type Board = typeof boards.$inferSelect;
export type InsertBoard = typeof boards.$inferInsert;
