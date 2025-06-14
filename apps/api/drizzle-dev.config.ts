import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

// TODO: Seems like this is not working. It always uses the .env file. Make it work.
dotenv.config({ path: path.join(__dirname, '.env.development.local') });

export default defineConfig({
  out: './src/libs/db/migrations',
  schema: './src/libs/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
