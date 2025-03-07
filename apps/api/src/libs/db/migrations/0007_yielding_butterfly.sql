CREATE TABLE "standup_form_schemas" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_id" integer NOT NULL,
	"schema" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "standup_form_schemas" ADD CONSTRAINT "standup_form_schemas_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;