import { Module } from '@nestjs/common';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../libs/db/schema';

export type Database = NodePgDatabase<typeof schema> & {
  $client: Pool;
};

export const DATABASE_TOKEN = 'DB';

@Module({
  providers: [
    {
      provide: DATABASE_TOKEN,
      useFactory: () => {
        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
          throw new Error('DATABASE_URL is not set');
        }

        const pool = new Pool({
          connectionString: databaseUrl,
        });
        const db = drizzle(pool, { schema });
        return db;
      },
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DbModule {}
