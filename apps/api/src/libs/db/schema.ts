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
  standups: many(standups), // Add this line
}));

export type Board = typeof boards.$inferSelect;
export type InsertBoard = typeof boards.$inferInsert;

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

export const standups = pgTable('standups', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id),
  userId: uuid('user_id').notNull(), // User who submitted the standup
  formData: jsonb('form_data').notNull(), // The actual standup responses
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const standupsRelations = relations(standups, ({ one }) => ({
  board: one(boards, {
    fields: [standups.boardId],
    references: [boards.id],
  }),
}));

export type Standup = typeof standups.$inferSelect;
export type InsertStandup = typeof standups.$inferInsert;
