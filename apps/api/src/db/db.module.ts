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
          keepAlive: true,
          connectionTimeoutMillis: 10000, // ensures you don't wait too long for new connections
          idleTimeoutMillis: 30000, // ensures you're not reusing potentially stale connections
        });

        pool.on('error', (error) => {
          console.error('Unexpected error on database connection:', error);

          // Simple reconnection approach with a reasonable delay
          console.log('Attempting to reconnect to database...');
          setTimeout(() => {
            pool
              .connect()
              .then((client) => {
                console.log('Successfully reconnected to database');
                client.release();
              })
              .catch((error) => console.error('Reconnect failed:', error));
          }, 5000);
        });

        const db = drizzle(pool, { schema });
        return db;
      },
    },
  ],
  exports: [DATABASE_TOKEN],
})
export class DbModule {}
