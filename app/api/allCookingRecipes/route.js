import prisma from '../../../lib/PrismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions/route';

export async function GET(req) {
  try {
    // Parse query parameters for pagination and filtering
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const selectedValue = searchParams.get('selectedValue');

    const session = await getServerSession(authOptions);
    const email = session?.user?.email || '';

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Build the query object
    const query = {};
    if (email && !selectedValue) {
      query.createdBy = email;
    }
    if (selectedValue) {
      query.selectedValue = selectedValue;
    }

    // Fetch the meals and related users
    const allCookingRecipes = await prisma.meal.findMany({
      where: query,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        usersWhoLikesThisRecipe: true,
        usersWhoPutEmojiOnThisRecipe: true,
        usersWhoPutHeartOnThisRecipe: true,
      },
    });

    return new Response(JSON.stringify(allCookingRecipes), {
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
export async function PUT(req) {
  try {
    const {
      id,
      email,
      action, // can be 'like', 'emoji', 'heart'
    } = await req.json();

    const data = {
      usersWhoLikesThisRecipe: undefined,
      usersWhoPutEmojiOnThisRecipe: undefined,
      usersWhoPutHeartOnThisRecipe: undefined,
    };

    if (action === 'like') {
      await prisma.usersWhoLikes.create({
        data: { mealId: id, email },
      });
    } else if (action === 'emoji') {
      await prisma.usersWhoPutEmoji.create({
        data: { mealId: id, email },
      });
    } else if (action === 'heart') {
      await prisma.usersWhoPutHeart.create({
        data: { mealId: id, email },
      });
    }

    return new Response(JSON.stringify({ message: 'Operation successful' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error updating meal:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    console.log('id', id);
    // Perform the delete operation using Prisma
    const deleteRecipe = await prisma.meal.delete({
      where: { id },
    });

    return new Response(JSON.stringify(deleteRecipe), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

//*********************************************************************************** */
// import mongoose from 'mongoose';
// import { Meal } from '../models/CreateMealModel';

// export async function GET() {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS);
//   const allCookingRecipes = await Meal?.find();
//   return Response.json(allCookingRecipes.reverse());
// }

// export async function DELETE(req) {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS);
//   const { _id } = await req.json();
//   const deleteRecipe = await Meal?.findByIdAndDelete({ _id });
//   return Response.json(deleteRecipe);
// }
// export async function PUT(req) {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS);
//   const {
//     _id,
//     usersWhoLikesThisRecipe,
//     usersWhoPutEmojiOnThisRecipe,
//     usersWhoPutHeartOnThisRecipe,
//     ...rest
//   } = await req.json();

//   const updateLikes = await Meal?.findByIdAndUpdate(
//     { _id },
//     {
//       usersWhoLikesThisRecipe: usersWhoLikesThisRecipe,
//       usersWhoPutEmojiOnThisRecipe: usersWhoPutEmojiOnThisRecipe,
//       usersWhoPutHeartOnThisRecipe: usersWhoPutHeartOnThisRecipe,
//       ...rest,
//     }
//   );
//   // console.log(updateLikes);
//   return Response.json(updateLikes);
// }
