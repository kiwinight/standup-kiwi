ALTER TABLE "boards" ADD COLUMN "timezone" text;

UPDATE "boards" SET "timezone" = 'Atlantic/St_Helena' WHERE "timezone" IS NULL;

ALTER TABLE "boards" ALTER COLUMN "timezone" SET NOT NULL;
