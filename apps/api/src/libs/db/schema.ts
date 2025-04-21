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
  AnyPgColumn,
} from 'drizzle-orm/pg-core';

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  activeStandupFormStructureId: integer(
    'active_standup_form_structure_id',
  ).references((): AnyPgColumn => standupFormStructures.id),
  name: text().notNull(),
  timezone: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Board = typeof boards.$inferSelect;
export type InsertBoard = typeof boards.$inferInsert;

export const standupFormStructures = pgTable('standup_form_structures', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id),
  schema: jsonb('schema').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type StandupFormStructure = typeof standupFormStructures.$inferSelect;
export type InsertStandupFormStructure =
  typeof standupFormStructures.$inferInsert;

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

export const standups = pgTable('standups', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id),
  userId: uuid('user_id').notNull(), // User who submitted the standup
  formStructureId: integer('form_structure_id')
    .notNull()
    .references(() => standupFormStructures.id),
  // TODO: I think this column name should be formValues
  formData: jsonb('form_data').notNull(), // The actual standup responses
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const boardsRelations = relations(boards, ({ many, one }) => ({
  usersToBoards: many(usersToBoards),
  standups: many(standups),
  standupFormStructures: many(standupFormStructures),
  activeStandupFormStructure: one(standupFormStructures, {
    fields: [boards.activeStandupFormStructureId],
    references: [standupFormStructures.id],
  }),
}));

export const standupFormStructuresRelations = relations(
  standupFormStructures,
  ({ one }) => ({
    board: one(boards, {
      fields: [standupFormStructures.boardId],
      references: [boards.id],
    }),
  }),
);

export const usersToBoardsRelations = relations(usersToBoards, ({ one }) => ({
  board: one(boards, {
    fields: [usersToBoards.boardId],
    references: [boards.id],
  }),
}));

export const standupsRelations = relations(standups, ({ one }) => ({
  board: one(boards, {
    fields: [standups.boardId],
    references: [boards.id],
  }),
  formStructure: one(standupFormStructures, {
    fields: [standups.formStructureId],
    references: [standupFormStructures.id],
  }),
}));

export type Standup = typeof standups.$inferSelect;
export type InsertStandup = typeof standups.$inferInsert;
