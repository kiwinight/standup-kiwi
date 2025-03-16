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
  formSchemas: jsonb('form_schemas').notNull(), // TODO: remove this
  activeStandupFormSchemaId: integer(
    'active_standup_form_schema_id',
  ).references((): AnyPgColumn => standupFormSchemas.id),
  name: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Board = typeof boards.$inferSelect;
export type InsertBoard = typeof boards.$inferInsert;

// TODO: rename table name to standupFormStructures!!
export const standupFormSchemas = pgTable('standup_form_schemas', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id),
  schema: jsonb('schema').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type StandupFormSchema = typeof standupFormSchemas.$inferSelect;
export type InsertStandupFormSchema = typeof standupFormSchemas.$inferInsert;

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
  formSchemaId: integer('form_schema_id')
    .notNull()
    .references(() => standupFormSchemas.id),
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
  standupFormSchemas: many(standupFormSchemas),
  activeStandupFormSchema: one(standupFormSchemas, {
    fields: [boards.activeStandupFormSchemaId],
    references: [standupFormSchemas.id],
  }),
}));

export const standupFormSchemasRelations = relations(
  standupFormSchemas,
  ({ one }) => ({
    board: one(boards, {
      fields: [standupFormSchemas.boardId],
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
  formSchema: one(standupFormSchemas, {
    fields: [standups.formSchemaId],
    references: [standupFormSchemas.id],
  }),
}));

export type Standup = typeof standups.$inferSelect;
export type InsertStandup = typeof standups.$inferInsert;
