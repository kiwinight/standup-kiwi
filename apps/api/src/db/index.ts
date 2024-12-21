import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'kiwi',
  password: process.env.DB_PASSWORD || 'kiwi123',
  database: process.env.DB_NAME || 'standup_kiwi',
});

export const db = drizzle(pool, { schema });
