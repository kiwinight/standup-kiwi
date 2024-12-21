import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.DB_HOST || 'postgres',
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || 'kiwi',
    password: process.env.DB_PASSWORD || 'kiwi123',
    database: process.env.DB_NAME || 'standup_kiwi',
  },
} satisfies Config;
