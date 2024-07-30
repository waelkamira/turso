import prisma from '../../../lib/PrismaClient';
import actionPrisma from '../../../lib/ActionPrismaClient';
import NodeCache from 'node-cache';

// تحسين التكوين مع تحديد حجم أقصى للذاكرة
const cache = new NodeCache({
  stdTTL: 60 * 10,
  checkperiod: 60,
  maxKeys: 1000,
});

function createCacheKey(params) {
  return `meals_${JSON.stringify(params)}`;
}

function invalidateCacheByPrefix(prefix) {
  const keys = cache.keys();
  keys.forEach((key) => {
    if (key.startsWith(prefix)) {
      cache.del(key);
    }
  });
}

export async function GET(req) {
  try {
    // Parse query parameters for pagination and filtering
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const selectedValue = searchParams.get('selectedValue');
    const id = searchParams.get('id'); // Keep as string
    const skip = (page - 1) * limit;

    // Build the query object
    const query = {};
    if (selectedValue) {
      query.selectedValue = selectedValue;
    }

    // إنشاء مفتاح التخزين المؤقت
    const cacheKey = createCacheKey({ id, page, limit, query });

    // محاولة الحصول على البيانات من التخزين المؤقت
    let meals = cache.get(cacheKey);
    if (!meals) {
      // التأكد من أن Prisma جاهزة
      await prisma.$connect();
      await actionPrisma.$connect();

      meals = await prisma.meal.findMany({
        where: query,
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit,
      });

      // تخزين البيانات في التخزين المؤقت
      cache.set(cacheKey, meals);
    }

    // مراقبة الأداء
    console.log('Cache Stats:', cache.getStats());

    return new Response(JSON.stringify(meals), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function POST(req) {
  await prisma.$connect();

  const data = await req.json();
  console.log('data', data);

  try {
    const meal = await prisma.meal.create({
      data: { ...data },
    });

    // تحديث التخزين المؤقت
    invalidateCacheByPrefix('meals_'); // إزالة المفاتيح المتعلقة بالوجبات

    return new Response(JSON.stringify(meal), { status: 201 });
  } catch (error) {
    console.error('Error creating meal:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');
  const { actionType, newActionValue, ...data } = await req.json();
  await prisma.$connect();
  await actionPrisma.$connect();

  try {
    const meal = await prisma.meal.findUnique({ where: { id } });

    let updateData = {};
    if (actionType && newActionValue) {
      function getUpdatedValue(currentValue, actionValue) {
        const newValue = currentValue + (actionValue === 1 ? 1 : -1);
        return newValue >= 0 ? newValue : currentValue;
      }

      if (actionType === 'hearts') {
        updateData = { hearts: getUpdatedValue(meal?.hearts, newActionValue) };
      } else if (actionType === 'likes') {
        updateData = { likes: getUpdatedValue(meal?.likes, newActionValue) };
      } else if (actionType === 'emojis') {
        updateData = { emojis: getUpdatedValue(meal?.emojis, newActionValue) };
      }

      await prisma.meal.update({
        where: { id },
        data: updateData,
      });
    } else {
      await prisma.meal.update({
        where: { id },
        data: data,
      });
    }

    // تحديث التخزين المؤقت
    invalidateCacheByPrefix('meals_'); // إزالة المفاتيح المتعلقة بالوجبات

    return new Response(
      JSON.stringify({ message: 'تم التعديل بنجاح', newActionValue }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating meal:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');
  const isAdmin = searchParams.get('isAdmin');
  await prisma.$connect();
  await actionPrisma.$connect();
  console.log(
    'id from delete ********************',
    id,
    isAdmin,
    typeof isAdmin,
    email
  );

  try {
    if (isAdmin === 'true') {
      console.log('id from delete ********************', id, isAdmin);

      const actionsExist = await actionPrisma.action.findMany({
        where: { mealId: id },
      });

      if (actionsExist.length > 0) {
        const actionsExist = await actionPrisma.action.findMany({
          where: { mealId: id },
        });

        await actionPrisma.action.deleteMany({
          where: { mealId: id },
        });
      }

      // Delete the meal
      await prisma.meal.delete({
        where: { id },
      });

      return new Response(
        JSON.stringify({
          message: 'Meal deleted successfully ✔',
        }),
        { status: 200 }
      );
    }

    // Check if id and email are provided
    if (!id || !email) {
      return new Response(
        JSON.stringify({ error: 'Meal ID and email must be provided' }),
        { status: 400 }
      );
    }

    // Check if the meal exists and is created by the given email
    const mealExists = await prisma.meal.findUnique({
      where: { id, createdBy: email },
    });

    if (!mealExists) {
      return new Response(
        JSON.stringify({
          error:
            'Meal not found or you do not have permission to delete this meal',
        }),
        { status: 404 }
      );
    }

    // console.log('id from delete ********************', id);
    // console.log('type of id', typeof id);
    // Check if actions exist for this meal
    const actionsExist = await actionPrisma.action.findMany({
      where: { mealId: id },
    });

    if (actionsExist.length > 0) {
      const actionsExist = await actionPrisma.action.findMany({
        where: { mealId: id },
      });

      await actionPrisma.action.deleteMany({
        where: { mealId: id },
      });
    }

    // Delete the meal
    await prisma.meal.delete({
      where: { id },
    });

    //! هذه خاصة بالأدمن فقط لحذف أي منشور مخالف

    // Invalidate cache related to meals
    invalidateCacheByPrefix('meals_');

    return new Response(
      JSON.stringify({
        message: 'Meal deleted successfully ✔',
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting meal:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal Server Error',
      }),
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
    await actionPrisma.$disconnect();
  }
}

// import prisma from '../../../lib/PrismaClient';

// export async function GET(req) {
//   try {
//     // Parse query parameters for pagination and filtering
//     const url = new URL(req.url);
//     const searchParams = url.searchParams;
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 5;
//     const selectedValue = searchParams.get('selectedValue');
//     const id = searchParams.get('id'); // Keep as string
//     const skip = (page - 1) * limit;

//     // Build the query object
//     const query = {};
//     if (selectedValue) {
//       query.selectedValue = selectedValue;
//     }

//     // Fetch the meal from the database
//     let meals;
//     if (id) {
//       meals = await prisma.meal?.findUnique({
//         where: { id }, // Convert to number for the database
//       });
//     } else {
//       meals = await prisma.meal?.findMany({
//         where: Object.keys(query).length ? query : undefined,
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take: limit,
//       });
//     }

//     // Convert meals to an array if a single object is fetched
//     meals = Array.isArray(meals) ? meals : [meals].filter(Boolean);

//     return new Response(JSON.stringify(meals), {
//       headers: { 'Content-Type': 'application/json' },
//       status: 200,
//     });
//   } catch (error) {
//     console.error('Error fetching recipes:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       headers: { 'Content-Type': 'application/json' },
//       status: 500,
//     });
//   }
// }

// export async function PUT(req) {
//   const url = new URL(req.url);
//   const searchParams = url.searchParams;
//   const id = searchParams.get('id');
//   const { actionType, newActionValue, ...data } = await req.json();

//   console.log(
//     'data ***********************************',
//     actionType,
//     newActionValue,
//     id,
//     typeof id
//   );
//   try {
//     const meal = await prisma.meal.findUnique({ where: { id } });
//     // console.log('meal ***********************************', meal);

//     if (actionType && newActionValue) {
//       // دالة مساعدة لحساب القيم المحدثة
//       function getUpdatedValue(currentValue, actionValue) {
//         const newValue = currentValue + (actionValue === 1 ? 1 : -1);
//         return newValue >= 0 ? newValue : currentValue;
//       }

//       let updateData = {};
//       if (actionType === 'hearts') {
//         updateData = { hearts: getUpdatedValue(meal?.hearts, newActionValue) };
//       } else if (actionType === 'likes') {
//         updateData = { likes: getUpdatedValue(meal?.likes, newActionValue) };
//       } else if (actionType === 'emojis') {
//         updateData = { emojis: getUpdatedValue(meal?.emojis, newActionValue) };
//       }

//       await prisma.meal.update({
//         where: { id },
//         data: updateData,
//       });

//       return new Response(
//         JSON.stringify({ message: 'تم التعديل بنجاح', newActionValue })
//       );
//     }

//     await prisma.meal.update({
//       where: { id },
//       data: data,
//     });

//     return new Response(JSON.stringify({ message: 'تم التعديل بنجاح' }));
//   } catch (error) {
//     console.error('Error updating meal:', error);
//     return new Response(JSON.stringify({ error: 'حدث خطأ ما' }));
//   }
// }

// export async function DELETE(req) {
//   const { id, email } = await req.json();
//   console.log(id);
//   console.log(email);
//   console.log(typeof id);

//   // تحقق إذا كانت الوجبة موجودة وأن المستخدم صاحب الوجبة
//   const mealExists = await prisma.meal?.findMany({
//     where: { id: id, createdBy: email }, // استخدم id كنص
//   });
//   console.log('mealExists', mealExists);

//   if (!mealExists) {
//     return new Response(
//       JSON.stringify({
//         error:
//           'Meal not found or you do not have permission to delete this meal',
//       }),
//       {
//         status: 404,
//       }
//     );
//   }

//   // تحقق واحذف القلوب المرتبطة (إذا وجدت)
//   const heartsExist = await prisma.action?.findMany({
//     where: { mealId: id, userEmail: email }, // استخدم id كنص
//   });

//   if (heartsExist?.length > 0) {
//     await prisma.action?.deleteMany({
//       where: { mealId: id, userEmail: email }, // استخدم id كنص
//     });
//   }

//   // احذف الوجبة
//   await prisma.meal?.delete({
//     where: { id }, // استخدم id كنص
//   });
//   return new Response(
//     JSON.stringify({
//       message: 'تم الحذف بنجاح ✔',
//     })
//   );
// }
