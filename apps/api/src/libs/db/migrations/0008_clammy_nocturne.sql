-- First create form schemas for each board that has standups
INSERT INTO "standup_form_schemas" (board_id, schema)
SELECT DISTINCT board_id, '{
  "title": "Today''s Standup",
  "fields": [
    {
      "name": "yesterday",
      "label": "What did you do yesterday?",
      "placeholder": "Write your reply here...",
      "type": "textarea",
      "required": true
    },
    {
      "name": "today",
      "label": "What will you do today?",
      "placeholder": "Write your reply here...",
      "type": "textarea",
      "required": true
    },
    {
      "name": "blockers",
      "label": "Do you have any blockers?",
      "placeholder": "Write your reply here...",
      "description": "Share any challenges or obstacles that might slow down your progress",
      "type": "textarea",
      "required": false
    }
  ]
}'::jsonb as schema
FROM standups;--> statement-breakpoint

-- Add the nullable column
ALTER TABLE "standups" ADD COLUMN "form_schema_id" integer;--> statement-breakpoint

-- Add the foreign key constraint
ALTER TABLE "standups" ADD CONSTRAINT "standups_form_schema_id_standup_form_schemas_id_fk" FOREIGN KEY ("form_schema_id") REFERENCES "public"."standup_form_schemas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint

-- Update existing records to link to their board's form schema
UPDATE standups s
SET form_schema_id = fs.id
FROM standup_form_schemas fs
WHERE s.board_id = fs.board_id;--> statement-breakpoint

-- Then add the NOT NULL constraint
ALTER TABLE "standups" ALTER COLUMN "form_schema_id" SET NOT NULL;