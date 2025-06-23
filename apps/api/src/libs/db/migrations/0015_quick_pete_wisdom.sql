CREATE TYPE "public"."invitation_status" AS ENUM('pending', 'used', 'revoked');--> statement-breakpoint
ALTER TYPE "public"."member_role" RENAME TO "collaborator_role";--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"board_id" integer NOT NULL,
	"inviter_user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"role" "collaborator_role" DEFAULT 'admin' NOT NULL,
	"status" "invitation_status" DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "role" SET DEFAULT 'collaborator'::text;--> statement-breakpoint
ALTER TABLE "users_to_boards" ALTER COLUMN "role" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."collaborator_role";--> statement-breakpoint
CREATE TYPE "public"."collaborator_role" AS ENUM('admin', 'collaborator');--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "role" SET DEFAULT 'collaborator'::"public"."collaborator_role";--> statement-breakpoint
ALTER TABLE "invitations" ALTER COLUMN "role" SET DATA TYPE "public"."collaborator_role" USING "role"::"public"."collaborator_role";--> statement-breakpoint
ALTER TABLE "users_to_boards" ALTER COLUMN "role" SET DATA TYPE "public"."collaborator_role" USING "role"::"public"."collaborator_role";--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_board_id_boards_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."boards"("id") ON DELETE cascade ON UPDATE no action;