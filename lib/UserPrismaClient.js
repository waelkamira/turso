import { PrismaClient as UserPrismaClient } from '@prisma/client';
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient as createUserClient } from '@libsql/client';

const userLibsql = createUserClient({
  url: process.env.NEXT_PUBLIC_TURSO_USER_URL,
  authToken: process.env.NEXT_PUBLIC_TURSO_USER_TOKEN,
});

const userAdapter = new PrismaLibSQL(userLibsql);
const userPrisma = new UserPrismaClient({ adapter: userAdapter });

export default userPrisma;
