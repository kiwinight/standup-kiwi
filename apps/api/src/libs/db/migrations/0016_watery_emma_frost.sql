ALTER TABLE "invitations" ADD COLUMN "deactivated_at" timestamp;--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "status";--> statement-breakpoint
DROP TYPE "public"."invitation_status";