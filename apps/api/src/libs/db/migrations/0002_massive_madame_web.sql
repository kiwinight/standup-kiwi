-- Step 1: Add the column without the NOT NULL constraint
ALTER TABLE "users" ADD COLUMN "password" varchar(255);

-- Step 2: Update existing rows with a default value or handle them as needed
UPDATE "users" SET "password" = 'default_password' WHERE "password" IS NULL;

-- Step 3: Alter the column to add the NOT NULL constraint
ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL;