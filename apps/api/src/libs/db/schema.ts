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
  pgEnum,
} from 'drizzle-orm/pg-core';

// Member roles enum
export const memberRoleEnum = pgEnum('member_role', ['admin', 'member']);

export const boards = pgTable('boards', {
  id: serial('id').primaryKey(),
  activeStandupFormId: integer('active_standup_form_id').references(
    (): AnyPgColumn => standupForms.id,
  ),
  name: text().notNull(),
  timezone: text().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Board = typeof boards.$inferSelect;
export type InsertBoard = typeof boards.$inferInsert;

// NOTE: This is insert only table
// TODO: Add a trigger to prevent updating and deleting rows
export const standupForms = pgTable('standup_forms', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id),
  schema: jsonb('schema').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type StandupForm = typeof standupForms.$inferSelect;
export type InsertStandupForm = typeof standupForms.$inferInsert;

export const usersToBoards = pgTable(
  'users_to_boards',
  {
    userId: uuid('user_id').notNull(), // User from another auth service
    boardId: integer('board_id')
      .notNull()
      .references(() => boards.id),
    role: memberRoleEnum('role').notNull().default('member'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.boardId] })],
);

export const standups = pgTable('standups', {
  id: serial('id').primaryKey(),
  boardId: integer('board_id')
    .notNull()
    .references(() => boards.id),
  userId: uuid('user_id').notNull(), // User who submitted the standup
  formId: integer('form_id')
    .notNull()
    .references(() => standupForms.id),
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
  standupForms: many(standupForms),
  activeStandupForm: one(standupForms, {
    fields: [boards.activeStandupFormId],
    references: [standupForms.id],
  }),
}));

export const standupFormsRelations = relations(standupForms, ({ one }) => ({
  board: one(boards, {
    fields: [standupForms.boardId],
    references: [boards.id],
  }),
}));

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
  form: one(standupForms, {
    fields: [standups.formId],
    references: [standupForms.id],
  }),
}));

export type Standup = typeof standups.$inferSelect;
export type InsertStandup = typeof standups.$inferInsert;

export type UsersToBoards = typeof usersToBoards.$inferSelect;
export type InsertUsersToBoards = typeof usersToBoards.$inferInsert;
export type MemberRole = (typeof memberRoleEnum.enumValues)[number];
