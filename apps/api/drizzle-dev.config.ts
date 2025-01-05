import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env.development.local') });
console.log(
  'Loaded .env file:',
  path.join(__dirname, '.env.development.local'),
);
console.log('DATABASE_URL:', process.env.DATABASE_URL);

export default defineConfig({
  out: './src/libs/db/migrations',
  schema: './src/libs/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
