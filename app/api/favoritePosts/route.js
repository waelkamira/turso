import prisma from '../../../lib/PrismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions/route';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;

    const skip = (page - 1) * limit;

    const query = {};
    if (email) {
      query.user = { email };
    }

    const favoritePosts = await prisma.favorite.findMany({
      where: Object.keys(query).length ? query : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        meal: true, // Include related meal details
      },
    });

    return new Response(JSON.stringify(favoritePosts), { status: 200 });
  } catch (error) {
    console.error('Error fetching favorite posts:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function POST(req) {
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

    return new Response(JSON.stringify(favoritePost), { status: 201 });
  } catch (error) {
    console.error('Error creating favorite post:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function DELETE(req) {
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

    return new Response(JSON.stringify(deleteFavoritePost), { status: 200 });
  } catch (error) {
    console.error('Error deleting favorite post:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

// import { favoritesConnection } from '../../../lib/MongoDBConnections'; // Adjust the import path accordingly
// import { Favorite } from '../models/FavoritePosts';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../authOptions/route';
// const initializeConnections = require('../../../lib/MongoDBConnections');
// const { favoritesConnection } = await initializeConnections();

// // Ensure the connection is ready before using it
// async function ensureConnection() {
//   if (!favoritesConnection.readyState) {
//     await favoritesConnection.openUri(
//       process.env.NEXT_PUBLIC_MONGODB_FAVORITES
//     );
//   }
// }

// export async function POST(req) {
//   await ensureConnection();

//   const data = await req.json();
//   const FavoriteModel = favoritesConnection.model('Favorite', Favorite.schema);
//   const FavoritePost = await FavoriteModel.create({ ...data });

//   return new Response(JSON.stringify(FavoritePost), { status: 201 });
// }

// export async function DELETE(req) {
//   await ensureConnection();

//   const data = await req.json();
//   const FavoriteModel = favoritesConnection.model('Favorite', Favorite.schema);
//   const deleteFavoritePost = await FavoriteModel.findByIdAndDelete(data?._id);

//   return new Response(JSON.stringify(deleteFavoritePost), { status: 200 });
// }

// export async function GET(req) {
//   await ensureConnection();
//   const { searchParams } = new URL(req.url);
//   const page = parseInt(searchParams.get('page') || 1);
//   const limit = parseInt(searchParams.get('limit') || 10);
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;

//   const skip = (page - 1) * limit;
//   // build query

//   const query = {};
//   if (email) {
//     query.favoritedByUser = email;
//   }
//   const FavoriteModel = favoritesConnection.model('Favorite', Favorite.schema);
//   const favoritePosts = await FavoriteModel.find(query)
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);
//   // console.log('favoritePosts', favoritePosts.length);
//   return new Response(JSON.stringify(favoritePosts), { status: 200 });
// }

// import mongoose from 'mongoose';
// import { Favorite } from '../models/FavoritePosts';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../authOptions/route';

// export async function POST(req) {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB);
//   const data = await req.json();
//   //   console.log('data from favoritePosts', data);
//   const FavoritePost = await Favorite.create({ ...data });
//   return Response.json(FavoritePost);
// }

// export async function DELETE(req) {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB);
//   const data = await req.json();
//   const deleteFavoritePost = await Favorite.findByIdAndDelete(data?._id);
//   return Response.json(deleteFavoritePost);
// }

// export async function GET() {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB);
//   const session = await getServerSession(authOptions);
//   const favoritedByUser = session?.user?.email;
//   // console.log('favoritedByUser', favoritedByUser);
//   const favoritePosts = await Favorite.find({ favoritedByUser });
//   // console.log('favoritePosts', favoritePosts);
//   return Response.json(favoritePosts);
// }
