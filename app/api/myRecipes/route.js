import { NextResponse } from 'next/server';
import actionPrisma from '../../../lib/ActionPrismaClient';
import prisma from '../../../lib/PrismaClient';
import NodeCache from 'node-cache';
import { authOptions } from '../authOptions/route';
import { getServerSession } from 'next-auth';
// إنشاء كائن للتخزين المؤقت
const cache = new NodeCache({ stdTTL: 60 * 10 }); // التخزين لمدة 10 دقائق

export async function GET(req) {
  const { searchParams } = new URL(req.url, 'http://localhost');
  // const email = searchParams.get('email') || '';
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const page = parseInt(searchParams.get('page')) || 1;

  console.log('email', email, page);
  try {
    if (!email) {
      return NextResponse.json(
        { message: 'يجب توفير البريد الإلكتروني' },
        { status: 400 }
      );
    }

    // التأكد من أن Prisma جاهزة
    await prisma.$connect();
    // إنشاء مفتاح للتخزين المؤقت
    const cacheKeyCount = `userRecipesCount_${email}`;
    const cacheKeyRecipes = `userRecipes_${email}_page_${page}`;
    console.log('email', email, page);

    // محاولة الحصول على البيانات من التخزين المؤقت
    let userRecipesCount = cache.get(cacheKeyCount);
    let userRecipes = cache.get(cacheKeyRecipes);

    if (userRecipesCount === undefined) {
      // Fetch the count of meals created by the user
      userRecipesCount = await prisma.meal.count({
        where: { createdBy: email },
      });
      console.log('email', email, page);

      // تخزين النتائج في التخزين المؤقت
      cache.set(cacheKeyCount, userRecipesCount);
    }

    if (page === 1 && !userRecipes) {
      // Fetch the first 5 meals created by the user
      userRecipes = await prisma.meal.findMany({
        where: { createdBy: email },
        orderBy: { createdAt: 'desc' },
        take: 5,
      });
      console.log('email', email, page);

      // تخزين النتائج في التخزين المؤقت
      cache.set(cacheKeyRecipes, userRecipes);
    }

    return NextResponse.json({
      count: userRecipesCount,
      recipes: page === 1 ? userRecipes : [],
    });
  } catch (error) {
    console.error('Error fetching user recipes data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
export async function DELETE(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  console.log(id);
  console.log(email);
  console.log(typeof id);
  await prisma.$connect(); // التأكد من أن Prisma جاهزة
  // تحقق إذا كانت الوجبة موجودة وأن المستخدم صاحب الوجبة
  const mealExists = await prisma?.meal?.findMany({
    where: { id, createdBy: email }, // استخدم id كنص
  });
  console.log('mealExists', mealExists);

  if (!mealExists) {
    return new Response(
      JSON.stringify({
        error:
          'Meal not found or you do not have permission to delete this meal',
      }),
      {
        status: 404,
      }
    );
  }

  // تحقق واحذف القلوب المرتبطة (إذا وجدت)
  const heartsExist = await actionPrisma.action?.findMany({
    where: { mealId: id, userEmail: email }, // استخدم id كنص
  });

  if (heartsExist?.length > 0) {
    await actionPrisma.action?.deleteMany({
      where: { mealId: id, userEmail: email }, // استخدم id كنص
    });
  }

  // احذف الوجبة
  await prisma.meal?.delete({
    where: { id }, // استخدم id كنص
  });

  // إزالة البيانات القديمة من التخزين المؤقت بعد الحذف
  cache.flushAll();

  return new Response(
    JSON.stringify({
      message: 'تم الحذف بنجاح ✔',
    })
  );
}
// import { NextResponse } from 'next/server';
// import prisma from '../../../lib/PrismaClient';
// import NodeCache from 'node-cache';

// // إنشاء كائن للتخزين المؤقت
// const cache = new NodeCache({ stdTTL: 60 * 10 }); // التخزين لمدة 10 دقائق

// export async function GET(req) {
//   // Extract the search parameters outside the try/catch block
//   const { searchParams } = new URL(req.url, 'http://localhost');
//   const page = parseInt(searchParams.get('page')) || 1;
//   const limit = parseInt(searchParams.get('limit')) || 5;
//   const email = searchParams.get('email') || '';
//   console.log('email =========', email);

//   try {
//     // Calculate the number of documents to skip
//     const skip = (page - 1) * limit;

//     // Build the query object
//     const query = {};
//     if (email) {
//       query.createdBy = email;
//     } else {
//       return NextResponse.json({ message: 'لا يوجد نتائج لعرضها' });
//     }

//     // إنشاء مفتاح للتخزين المؤقت
//     const cacheKey = `allCookingRecipes_${email}_${page}_${limit}`;

//     // محاولة الحصول على البيانات من التخزين المؤقت
//     let allCookingRecipes = cache.get(cacheKey);
//     if (!allCookingRecipes) {
//       // Fetch the meals and related users
//       allCookingRecipes = await prisma.meal?.findMany({
//         where: Object.keys(query).length ? query : undefined,
//         orderBy: { createdAt: 'desc' },
//         skip,
//         take: limit,
//       });

//       // تخزين النتائج في التخزين المؤقت
//       cache.set(cacheKey, allCookingRecipes);
//     }

//     return NextResponse.json(allCookingRecipes);
//   } catch (error) {
//     console.error('Error fetching recipes:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// /
