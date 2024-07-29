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
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;

  const skip = (page - 1) * limit;
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
      // جلب عدد الوجبات التي أنشأها المستخدم
      userRecipesCount = await prisma.meal.count({
        where: { createdBy: email },
      });
      console.log('email', email, page);

      // تخزين النتائج في التخزين المؤقت
      cache.set(cacheKeyCount, userRecipesCount);
    }

    if (!userRecipes) {
      // جلب الوجبات التي أنشأها المستخدم للصفحة المطلوبة
      userRecipes = await prisma.meal.findMany({
        where: { createdBy: email },
        orderBy: { createdAt: 'desc' },
        skip: skip,
        take: limit,
      });
      console.log('email', email, page);

      // تخزين النتائج في التخزين المؤقت
      cache.set(cacheKeyRecipes, userRecipes);
    }

    return NextResponse.json({
      count: userRecipesCount,
      recipes: userRecipes,
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

  if (!id || !email) {
    return NextResponse.json(
      { error: 'يجب توفير معرف الوجبة والبريد الإلكتروني' },
      { status: 400 }
    );
  }

  try {
    await prisma.$connect(); // التأكد من أن Prisma جاهزة

    // تحقق إذا كانت الوجبة موجودة وأن المستخدم صاحب الوجبة
    const mealExists = await prisma.meal.findFirst({
      where: { id, createdBy: email }, // استخدم id كنص
    });

    console.log('mealExists', mealExists);

    if (!mealExists) {
      return NextResponse.json(
        {
          error: 'لم يتم العثور على الوجبة أو لا تملك صلاحية حذف هذه الوجبة',
        },
        { status: 404 }
      );
    }

    // استخدام معاملة لحذف الوجبة والقلوب المرتبطة بها
    await prisma.$transaction([
      prisma.action.deleteMany({
        where: { mealId: id, userEmail: email }, // استخدم id كنص
      }),
      prisma.meal.delete({
        where: { id }, // استخدم id كنص
      }),
    ]);

    // إزالة البيانات القديمة من التخزين المؤقت بعد الحذف
    cache.flushAll();

    return NextResponse.json({ message: 'تم الحذف بنجاح ✔' });
  } catch (error) {
    console.error('Error deleting meal:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
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
