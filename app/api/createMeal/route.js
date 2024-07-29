import prisma from '../../../lib/PrismaClient';

export async function POST(req) {
  await prisma.$connect(); // التأكد من أن Prisma جاهزة

  const data = await req.json();
  console.log('data', data);

  const meal = await prisma.meal.create({
    data: { ...data },
  });
  return new Response(JSON.stringify(meal), { status: 201 });
}

// // import { mealsConnection } from '../../../lib/MongoDBConnections'; // Adjust the import path accordingly
// import { Meal } from '../models/CreateMealModel';
// const initializeConnections = require('../../../lib/MongoDBConnections');
// const { mealsConnection } = await initializeConnections();

// export async function POST(req) {
//   const data = await req.json();

//   // Ensure the mealsConnection is ready to be used
//   if (!mealsConnection.readyState) {
//     await mealsConnection.openUri(process.env.NEXT_PUBLIC_MONGODB_MEALS);
//   }

//   // Using the existing connection to perform the operation
//   const MealModel = mealsConnection.model('Meal', Meal.schema);
//   const meal = await MealModel.create({ ...data });

//   return new Response(JSON.stringify(meal), { status: 201 });
// }
//!---------------------------------------------------------------------------------------
// import mongoose from 'mongoose';
// import { Meal } from '../models/CreateMealModel';
// export async function POST(req) {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS);
//   const data = await req.json();
//   // console.log('data', data);
//   const meal = await Meal.create({ ...data });
//   return Response.json(meal);
// }
