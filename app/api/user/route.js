import prisma from '../../../lib/PrismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions/route';

export async function PUT(req) {
  try {
    const { email, image, name } = await req.json();

    const user = await prisma.user.update({
      where: { email },
      data: { image, name },
    });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    if (!email) {
      return new Response(JSON.stringify({ error: 'User not authenticated' }), {
        status: 401,
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    return new Response(JSON.stringify(user ? [user] : []), { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
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
