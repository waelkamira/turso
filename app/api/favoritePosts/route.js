import prisma from '../../../lib/PrismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions/route';
import NodeCache from 'node-cache';

// إنشاء كائن للتخزين المؤقت
const cache = new NodeCache({ stdTTL: 60 * 10 }); // التخزين لمدة 10 دقائق

export async function GET(req) {
  await prisma.$connect(); // التأكد من أن Prisma جاهزة

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    const skip = (page - 1) * limit;

    const query = {};
    if (email) {
      query.user = { email };
    }

    // إنشاء مفتاح للتخزين المؤقت
    const cacheKey = `favoritePosts_${email || 'all'}_${page}_${limit}`;

    // محاولة الحصول على البيانات من التخزين المؤقت
    let favoritePosts = cache.get(cacheKey);
    if (!favoritePosts) {
      favoritePosts = await prisma.favorite.findMany({
        where: Object.keys(query).length ? query : undefined,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          meal: true, // Include related meal details
        },
      });

      // تخزين النتائج في التخزين المؤقت
      cache.set(cacheKey, favoritePosts);
    }

    return new Response(JSON.stringify(favoritePosts), { status: 200 });
  } catch (error) {
    console.error('Error fetching favorite posts:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  await prisma.$connect(); // التأكد من أن Prisma جاهزة
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  try {
    const data = await req.json();
    const favoritePost = await prisma.favorite.create({
      data: {
        user: { connect: { email } },
        meal: { connect: { id: data.mealId } },
      },
    });

    // إزالة البيانات القديمة من التخزين المؤقت بعد الإضافة
    cache.flushAll();

    return new Response(JSON.stringify(favoritePost), { status: 201 });
  } catch (error) {
    console.error('Error creating favorite post:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  await prisma.$connect(); // التأكد من أن Prisma جاهزة
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  try {
    const data = await req.json();
    const deleteFavoritePost = await prisma.favorite.deleteMany({
      where: {
        user: { email },
        mealId: data.mealId,
      },
    });

    // إزالة البيانات القديمة من التخزين المؤقت بعد الحذف
    cache.flushAll();

    return new Response(JSON.stringify(deleteFavoritePost), { status: 200 });
  } catch (error) {
    console.error('Error deleting favorite post:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// import prisma from '../../../lib/PrismaClient';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../authOptions/route';

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 5;
//     const session = await getServerSession(authOptions);
//     const email = session?.user?.email;

//     const skip = (page - 1) * limit;

//     const query = {};
//     if (email) {
//       query.user = { email };
//     }

//     const favoritePosts = await prisma.favorite.findMany({
//       where: Object.keys(query).length ? query : undefined,
//       orderBy: { createdAt: 'desc' },
//       skip,
//       take: limit,
//       include: {
//         meal: true, // Include related meal details
//       },
//     });

//     return new Response(JSON.stringify(favoritePosts), { status: 200 });
//   } catch (error) {
//     console.error('Error fetching favorite posts:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function POST(req) {
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;

//   try {
//     const data = await req.json();
//     const favoritePost = await prisma.favorite.create({
//       data: {
//         user: { connect: { email } },
//         meal: { connect: { id: data.mealId } },
//       },
//     });

//     return new Response(JSON.stringify(favoritePost), { status: 201 });
//   } catch (error) {
//     console.error('Error creating favorite post:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }

// export async function DELETE(req) {
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;

//   try {
//     const data = await req.json();
//     const deleteFavoritePost = await prisma.favorite.deleteMany({
//       where: {
//         user: { email },
//         mealId: data.mealId,
//       },
//     });

//     return new Response(JSON.stringify(deleteFavoritePost), { status: 200 });
//   } catch (error) {
//     console.error('Error deleting favorite post:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
//       status: 500,
//     });
//   }
// }
