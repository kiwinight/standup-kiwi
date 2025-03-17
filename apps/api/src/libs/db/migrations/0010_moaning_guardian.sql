ALTER TABLE "standup_form_schemas" RENAME TO "standup_form_structures";--> statement-breakpoint
ALTER TABLE "boards" RENAME COLUMN "active_standup_form_schema_id" TO "active_standup_form_structure_id";--> statement-breakpoint
ALTER TABLE "standups" RENAME COLUMN "form_schema_id" TO "form_structure_id";--> statement-breakpoint
ALTER TABLE "boards" DROP CONSTRAINT "boards_active_standup_form_schema_id_standup_form_schemas_id_fk";
--> statement-breakpoint
ALTER TABLE "standup_form_structures" DROP CONSTRAINT "standup_form_schemas_board_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "standups" DROP CONSTRAINT "standups_form_schema_id_standup_form_schemas_id_fk";
--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_active_standup_form_structure_id_standup_form_structures_id_fk" FOREIGN KEY ("active_standup_form_structure_id") REFERENCES "public"."standup_form_structures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standup_form_structures" ADD CONSTRAINT "standup_form_structures_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standups" ADD CONSTRAINT "standups_form_structure_id_standup_form_structures_id_fk" FOREIGN KEY ("form_structure_id") REFERENCES "public"."standup_form_structures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "boards" DROP COLUMN "form_schemas";