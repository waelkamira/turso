import { Client, createClient } from '@libsql/client/http';

export function tursoClient(): Client {
  const url = process.env.NEXT_PUBLIC_TURSO_URL?.trim();
  if (url === undefined) {
    throw new Error('NEXT_PUBLIC_TURSO_URL is not defined');
  }

  const authToken = process.env.NEXT_PUBLIC_TURSO_TOKEN?.trim();
  if (authToken === undefined) {
    if (!url.includes('file:')) {
      throw new Error('NEXT_PUBLIC_TURSO_TOKEN is not defined');
    }
  }

  return createClient({
    url,
    authToken,
  });
}
