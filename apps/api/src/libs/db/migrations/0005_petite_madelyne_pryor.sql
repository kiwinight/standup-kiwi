CREATE TABLE "standups" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_id" integer NOT NULL,
	"user_id" uuid NOT NULL,
	"form_data" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "standups" ADD CONSTRAINT "standups_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE no action ON UPDATE no action;