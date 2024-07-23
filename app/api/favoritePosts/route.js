// import { favoritesConnection } from '../../../lib/MongoDBConnections'; // Adjust the import path accordingly
import { Favorite } from '../models/FavoritePosts';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions/route';
const initializeConnections = require('../../../lib/MongoDBConnections');
const { favoritesConnection } = await initializeConnections();

// Ensure the connection is ready before using it
async function ensureConnection() {
  if (!favoritesConnection.readyState) {
    await favoritesConnection.openUri(
      process.env.NEXT_PUBLIC_MONGODB_FAVORITES
    );
  }
}

export async function POST(req) {
  await ensureConnection();

  const data = await req.json();
  const FavoriteModel = favoritesConnection.model('Favorite', Favorite.schema);
  const FavoritePost = await FavoriteModel.create({ ...data });

  return new Response(JSON.stringify(FavoritePost), { status: 201 });
}

export async function DELETE(req) {
  await ensureConnection();

  const data = await req.json();
  const FavoriteModel = favoritesConnection.model('Favorite', Favorite.schema);
  const deleteFavoritePost = await FavoriteModel.findByIdAndDelete(data?._id);

  return new Response(JSON.stringify(deleteFavoritePost), { status: 200 });
}

export async function GET(req) {
  await ensureConnection();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || 1);
  const limit = parseInt(searchParams.get('limit') || 10);
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  const skip = (page - 1) * limit;
  // build query

  const query = {};
  if (email) {
    query.favoritedByUser = email;
  }
  const FavoriteModel = favoritesConnection.model('Favorite', Favorite.schema);
  const favoritePosts = await FavoriteModel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  // console.log('favoritePosts', favoritePosts.length);
  return new Response(JSON.stringify(favoritePosts), { status: 200 });
}

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
