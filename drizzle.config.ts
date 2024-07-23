import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: './app/db/schema.ts',
  out: './migrations',
  dialect: 'sqlite',
  driver: 'turso',
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_TURSO_URL!,
    authToken: process.env.NEXT_PUBLIC_TURSO_TOKEN!,
  },
});
