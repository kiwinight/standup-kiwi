ALTER TABLE "standup_form_structures" RENAME TO "standup_forms";--> statement-breakpoint
ALTER TABLE "boards" RENAME COLUMN "active_standup_form_structure_id" TO "active_standup_form_id";--> statement-breakpoint
ALTER TABLE "standups" RENAME COLUMN "form_structure_id" TO "form_id";--> statement-breakpoint
ALTER TABLE "boards" DROP CONSTRAINT "boards_active_standup_form_structure_id_standup_form_structures_id_fk";
--> statement-breakpoint
ALTER TABLE "standup_forms" DROP CONSTRAINT "standup_form_structures_board_id_boards_id_fk";
--> statement-breakpoint
ALTER TABLE "standups" DROP CONSTRAINT "standups_form_structure_id_standup_form_structures_id_fk";
--> statement-breakpoint
ALTER TABLE "boards" ADD CONSTRAINT "boards_active_standup_form_id_standup_forms_id_fk" FOREIGN KEY ("active_standup_form_id") REFERENCES "public"."standup_forms"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standup_forms" ADD CONSTRAINT "standup_forms_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "standups" ADD CONSTRAINT "standups_form_id_standup_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."standup_forms"("id") ON DELETE no action ON UPDATE no action;