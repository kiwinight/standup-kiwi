CREATE TYPE "public"."member_role" AS ENUM('admin', 'member');--> statement-breakpoint
ALTER TABLE "users_to_boards" ADD COLUMN "role" "member_role" DEFAULT 'member' NOT NULL;