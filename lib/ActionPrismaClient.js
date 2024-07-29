import { PrismaClient as ActionPrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient as createActionClient } from '@libsql/client';

const actionLibsql = createActionClient({
  url: process.env.NEXT_PUBLIC_TURSO_ACTION_URL,
  authToken: process.env.NEXT_PUBLIC_TURSO_ACTION_TOKEN,
});

const actionAdapter = new PrismaLibSQL(actionLibsql);
const actionPrisma = new ActionPrismaClient({ adapter: actionAdapter });

export default actionPrisma;
