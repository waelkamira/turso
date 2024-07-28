import NodeCache from 'node-cache';
import prisma from '../../../lib/PrismaClient';

// إعداد التخزين المؤقت مع مدة تخزين مؤقت (مثلاً 10 دقائق)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const pageNumber = parseInt(searchParams.get('pageNumber') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '5', 10);
  const searchQuery = searchParams.get('searchQuery') || '';
  const email = searchParams.get('email') || '';

  // استخدم المفتاح الفريد لتخزين البيانات المؤقتة
  const cacheKey = `users_${pageNumber}_${limit}_${searchQuery}_${email}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    // إذا كانت البيانات موجودة في الذاكرة المؤقتة، ارجعها مباشرة
    return new Response(JSON.stringify(cachedData), { status: 200 });
  }

  try {
    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      // احفظ البيانات في الذاكرة المؤقتة
      cache.set(cacheKey, user);
      return new Response(JSON.stringify(user), { status: 200 });
    } else {
      const users = await prisma.user.findMany({
        where: {
          email: {
            contains: searchQuery,
          },
        },
        skip: (pageNumber - 1) * limit,
        take: limit,
      });
      // احفظ البيانات في الذاكرة المؤقتة
      cache.set(cacheKey, users);
      return new Response(JSON.stringify(users), { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function PUT(req) {
  try {
    const { email, image, name } = await req.json();

    const user = await prisma.user.update({
      where: { email },
      data: { image, name },
    });

    // مسح البيانات المؤقتة المتعلقة بالمستخدم المعدل
    cache.keys().forEach((key) => {
      if (key.includes(email)) {
        cache.del(key);
      }
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { email } = await req.json();

    // التحقق من وجود المستخدم قبل محاولة حذفه
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      console.error(`User with email ${email} not found.`);
      return new Response(JSON.stringify({ error: 'User not found' }), {
        status: 404,
      });
    }

    const deleteUser = await prisma.user.delete({
      where: { email },
    });

    // مسح البيانات المؤقتة المتعلقة بالمستخدم المحذوف
    cache.keys().forEach((key) => {
      if (key.includes(email)) {
        cache.del(key);
      }
    });

    return new Response(JSON.stringify(deleteUser), { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// import { usersConnection } from '../../../lib/MongoDBConnections'; // Adjust the import path accordingly
// import { User } from '../models/UserModel';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../authOptions/route';
// const initializeConnections = require('../../../lib/MongoDBConnections');
// const { usersConnection } = await initializeConnections();

// // Ensure the connection is ready before using it
// async function ensureConnection() {
//   if (!usersConnection.readyState) {
//     await usersConnection.openUri(process.env.NEXT_PUBLIC_MONGODB);
//   }
// }

// export async function PUT(req) {
//   await ensureConnection();

//   const { email, image, name } = await req.json();
//   const UserModel = usersConnection.model('User', User.schema);
//   const user = await UserModel.findOneAndUpdate(
//     { email },
//     { image, name },
//     { new: true } // Return the updated document
//   );

//   return new Response(JSON.stringify(user), { status: 200 });
// }

// export async function GET() {
//   await ensureConnection();

//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;

//   const UserModel = usersConnection.model('User', User.schema);
//   const user = await UserModel.find();
//   const allUsers = [, ...user];
//   const findUser = allUsers?.filter((item) => item?.email === email);

//   return new Response(JSON.stringify(findUser), { status: 200 });
// }

// import mongoose from 'mongoose';
// import { User } from '../models/UserModel';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../authOptions/route';

// export async function PUT(req) {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB);
//   const { email, image, name } = await req.json();
//   const user = await User.findOneAndUpdate(
//     { email },
//     { image: image, name: name }
//   );

//   return Response.json(user);
// }

// export async function GET() {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB);
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;
//   const user = await User.find();
//   const allUsers = [, ...user];
//   const findUser = allUsers?.filter((item) => item?.email === email);
//   return Response.json(findUser);
// }
