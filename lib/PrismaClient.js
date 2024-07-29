// prisma.ts or prisma.js
import { PrismaClient } from '@prisma/client';
// Import libSQL and the Prisma libSQL driver adapter
import { PrismaLibSQL } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';

// Instantiate libSQL
const libsql = createClient({
  url: process.env.NEXT_PUBLIC_TURSO_URL,
  authToken: process.env.NEXT_PUBLIC_TURSO_TOKEN,
});

// Instantiate the libSQL driver adapter
const adapter = new PrismaLibSQL(libsql);

// Create Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

// Export the Prisma Client
export default prisma;

// ! هذا كود لثبلث قواعد بيانات عند الحاجة
// // prisma/mealClient.ts
// import { PrismaClient as MealPrismaClient } from '@prisma/client';
// import { PrismaLibSQL } from '@prisma/adapter-libsql';
// import { createClient as createMealClient } from '@libsql/client';

// const mealLibsql = createMealClient({
//   url: process.env.NEXT_PUBLIC_TURSO_MEAL_URL,
//   authToken: process.env.NEXT_PUBLIC_TURSO_MEAL_TOKEN,
// });

// const mealAdapter = new PrismaLibSQL(mealLibsql);
// const mealPrisma = new MealPrismaClient({ adapter: mealAdapter });

// export default mealPrisma;

// // prisma/actionClient.ts
// import { PrismaClient as ActionPrismaClient } from '@prisma/client';
// import { PrismaLibSQL } from '@prisma/adapter-libsql';
// import { createClient as createActionClient } from '@libsql/client';

// const actionLibsql = createActionClient({
//   url: process.env.NEXT_PUBLIC_TURSO_ACTION_URL,
//   authToken: process.env.NEXT_PUBLIC_TURSO_ACTION_TOKEN,
// });

// const actionAdapter = new PrismaLibSQL(actionLibsql);
// const actionPrisma = new ActionPrismaClient({ adapter: actionAdapter });

// export default actionPrisma;

// // prisma/userClient.ts
// import { PrismaClient as UserPrismaClient } from '@prisma/client';
// import { PrismaLibSQL } from '@prisma/adapter-libsql';
// import { createClient as createUserClient } from '@libsql/client';

// const userLibsql = createUserClient({
//   url: process.env.NEXT_PUBLIC_TURSO_USER_URL,
//   authToken: process.env.NEXT_PUBLIC_TURSO_USER_TOKEN,
// });

// const userAdapter = new PrismaLibSQL(userLibsql);
// const userPrisma = new UserPrismaClient({ adapter: userAdapter });

// export default userPrisma;

//! الاستخدام كما يلي
// import mealPrisma from './prisma/mealClient';
// import actionPrisma from './prisma/actionClient';
// import userPrisma from './prisma/userClient';

// // استخدم كل عميل للعمليات الخاصة به
// const meals = await mealPrisma.meal.findMany();
// const actions = await actionPrisma.action.findMany();
// const users = await userPrisma.user.findMany();
