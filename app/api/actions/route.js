import actionPrisma from '../../../lib/ActionPrismaClient';
import prisma from '../../../lib/PrismaClient';
import NodeCache from 'node-cache';

// إنشاء كائن للتخزين المؤقت
const cache = new NodeCache({ stdTTL: 60 * 10 }); // التخزين لمدة 10 دقائق

// التأكد من الاتصال بقاعدة البيانات
async function ensurePrismaConnection() {
  try {
    await actionPrisma.$connect();
    await prisma.$connect();
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw new Error('Database connection error');
  }
}

// معالج طلب GET
export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const mealId = searchParams.get('mealId') || '';

  const email = searchParams.get('email') || '';
  const nonEmail = searchParams.get('nonEmail');
  const skip = (page - 1) * limit;

  await ensurePrismaConnection();

  try {
    const query = {};
    if (email && !nonEmail) {
      query.userEmail = email;
    }
    if (mealId) {
      query.mealId = mealId;
    }

    // إنشاء مفتاح للتخزين المؤقت
    const cacheKey = `actions_${JSON.stringify(query)}_${page}_${limit}`;

    // محاولة الحصول على البيانات من التخزين المؤقت
    let actionRecords = cache.get(cacheKey);
    if (!actionRecords) {
      // Fetch action records from the database
      actionRecords = await actionPrisma.action.findMany({
        where: query,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      });

      // تخزين النتائج في التخزين المؤقت
      cache.set(cacheKey, actionRecords);
    }

    return new Response(JSON.stringify(actionRecords));
  } catch (error) {
    console.error('Error fetching action records:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// معالج طلب POST
export async function POST(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const email = searchParams.get('email') || '';
  const data = await req.json();
  const mealId = data.mealId;
  const actionType = data.actionType;
  // console.log('email **************', email, actionType, mealId);

  await ensurePrismaConnection();

  if (!email) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      status: 401,
    });
  }

  try {
    if (!['likes', 'hearts', 'emojis'].includes(actionType)) {
      return new Response(JSON.stringify({ error: 'Invalid action type' }), {
        status: 400,
      });
    }

    const meal = await prisma.meal.findUnique({ where: { id: mealId } });
    // console.log('meal **************', meal, actionType, mealId, email);

    const existingAction = await actionPrisma.action.findFirst({
      where: {
        userEmail: email,
        mealId: mealId,
      },
    });

    let newActionValue;
    if (existingAction) {
      newActionValue = existingAction[actionType] === 1 ? 0 : 1;

      if (newActionValue === 0) {
        await actionPrisma.action.delete({
          where: { id: existingAction.id },
        });
      } else {
        await actionPrisma.action.update({
          where: { id: existingAction.id },
          data: { [actionType]: newActionValue },
        });
      }
    } else {
      newActionValue = 1;
      const newActionData = {
        userEmail: email,
        mealId: mealId,
        likes: 0,
        hearts: 0,
        emojis: 0,
      };
      newActionData[actionType] = newActionValue;

      await actionPrisma.action.create({
        data: newActionData,
      });
    }

    // تحديث عدد الـ hearts في الـ meal
    if (actionType === 'hearts') {
      const increment = newActionValue === 1 ? 1 : -1;
      if (meal) {
        const newHeartsValue = meal.hearts + increment;
        await prisma.meal.update({
          where: { id: mealId },
          data: {
            hearts: newHeartsValue >= 0 ? newHeartsValue : meal.hearts,
          },
        });
      }
    }

    // إزالة البيانات القديمة من التخزين المؤقت بعد التحديث
    cache.flushAll();

    let message = 'Action updated successfully';
    if (actionType === 'likes') {
      message = newActionValue
        ? 'تم الاعجاب بهذه الوصفة'
        : 'تم ازالة الاعجاب بهذه الوصفة';
    } else if (actionType === 'hearts') {
      message = newActionValue
        ? 'تم حفظ الوصفة في قائمتك المفضلة'
        : 'تم إزالة الوصفة من قائمتك المفضلة';
    } else if (actionType === 'emojis') {
      message = newActionValue ? 'لذيذ' : 'ليس لذيذ';
    }

    return new Response(JSON.stringify({ message, newActionValue }));
  } catch (error) {
    console.error('Error updating action:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// import prisma from '../../../lib/PrismaClient';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../authOptions/route';
// import NodeCache from 'node-cache';

// // إنشاء كائن للتخزين المؤقت
// const cache = new NodeCache({ stdTTL: 60 * 10 }); // التخزين لمدة 10 دقائق

// // معالج طلب GET
// export async function GET(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 5;
//   const mealId = searchParams.get('mealId') || '';
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;
//   const nonEmail = searchParams.get('nonEmail');
//   const skip = (page - 1) * limit;
//   try {
//     const query = {};
//     if (email && !nonEmail) {
//       query.userEmail = email;
//     }
//     if (mealId) {
//       query.mealId = mealId;
//     }

//     // إنشاء مفتاح للتخزين المؤقت
//     const cacheKey = `actions_${JSON.stringify(query)}_${page}_${limit}`;

//     // محاولة الحصول على البيانات من التخزين المؤقت
//     let actionRecords = cache.get(cacheKey);
//     if (!actionRecords) {
//       // Fetch action records from the database
//       actionRecords = await prisma.action.findMany({
//         where: query,
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take: limit,
//       });

//       // تخزين النتائج في التخزين المؤقت
//       cache.set(cacheKey, actionRecords);
//     }

//     return new Response(JSON.stringify(actionRecords));
//   } catch (error) {
//     console.error('Error fetching action records:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// // معالج طلب POST
// export async function POST(req) {
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;

//   if (!email) {
//     return new Response(JSON.stringify({ error: 'User not authenticated' }), {
//       status: 401,
//     });
//   }

//   try {
//     const data = await req.json();
//     const mealId = data.mealId;
//     const actionType = data.actionType;

//     if (!['likes', 'hearts', 'emojis'].includes(actionType)) {
//       return new Response(JSON.stringify({ error: 'Invalid action type' }), {
//         status: 400,
//       });
//     }

//     const meal = await prisma.meal.findUnique({ where: { id: mealId } });

//     const existingAction = await prisma.action.findFirst({
//       where: {
//         userEmail: email,
//         mealId: mealId,
//       },
//     });

//     let newActionValue;
//     if (existingAction) {
//       newActionValue = existingAction[actionType] === 1 ? 0 : 1;

//       if (newActionValue === 0) {
//         await prisma.action.delete({
//           where: { id: existingAction.id },
//         });
//       } else {
//         await prisma.action.update({
//           where: { id: existingAction.id },
//           data: { [actionType]: newActionValue },
//         });
//       }
//     } else {
//       newActionValue = 1;
//       const newActionData = {
//         userEmail: email,
//         mealId: mealId,
//         likes: 0,
//         hearts: 0,
//         emojis: 0,
//       };
//       newActionData[actionType] = newActionValue;

//       await prisma.action.create({
//         data: newActionData,
//       });
//     }

//     // تحديث عدد الـ hearts في الـ meal
//     if (actionType === 'hearts') {
//       const increment = newActionValue === 1 ? 1 : -1;
//       if (meal) {
//         const newHeartsValue = meal.hearts + increment;
//         await prisma.meal.update({
//           where: { id: mealId },
//           data: {
//             hearts: newHeartsValue >= 0 ? newHeartsValue : meal.hearts,
//           },
//         });
//       }
//     }

//     // إزالة البيانات القديمة من التخزين المؤقت بعد التحديث
//     cache.flushAll();

//     let message = 'Action updated successfully';
//     if (actionType === 'likes') {
//       message = newActionValue
//         ? 'تم الاعجاب بهذه الوصفة'
//         : 'تم ازالة الاعجاب بهذه الوصفة';
//     } else if (actionType === 'hearts') {
//       message = newActionValue
//         ? 'تم حفظ الوصفة في قائمتك المفضلة'
//         : 'تم إزالة الوصفة من قائمتك المفضلة';
//     } else if (actionType === 'emojis') {
//       message = newActionValue ? 'لذيذ' : 'ليس لذيذ';
//     }

//     return new Response(JSON.stringify({ message, newActionValue }));
//   } catch (error) {
//     console.error('Error updating action:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }
