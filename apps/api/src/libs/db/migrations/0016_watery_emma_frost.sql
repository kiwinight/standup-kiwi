ALTER TABLE "invitations" ADD COLUMN "deactivated_at" timestamp;--> statement-breakpoint
UPDATE "invitations" SET "deactivated_at" = "updated_at" WHERE "status" != 'pending';--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "status";--> statement-breakpoint
DROP TYPE "public"."invitation_status";