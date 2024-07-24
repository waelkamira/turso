import prisma from '../../../lib/PrismaClient';

export async function GET(req) {
  try {
    // Parse query parameters for pagination and filtering
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const selectedValue = searchParams.get('selectedValue');
    const id = parseInt(searchParams.get('id'));
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;
    // console.log('url', url);
    // Build the query object
    const query = {};
    if (id) {
      query.id = id;
    }
    if (selectedValue) {
      query.selectedValue = selectedValue;
    }

    // Fetch the meals and related users
    const allCookingRecipes = await prisma.meal.findMany({
      where: Object.keys(query).length ? query : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
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
  const url = new URL(req.url, `http://${req.headers.host}`);
  const searchParams = url.searchParams;
  const id = parseInt(searchParams.get('id'));
  const { actionType, newActionValue } = await req.json();

  try {
    const meal = await prisma.meal.findUnique({ where: { id } });

    let updateData = {};
    if (actionType === 'hearts') {
      const newHeartsValue = meal.hearts + (newActionValue === 1 ? 1 : -1);
      updateData = {
        hearts: newHeartsValue >= 0 ? newHeartsValue : meal.hearts,
      };
    } else if (actionType === 'likes') {
      const newLikesValue = meal.likes + (newActionValue === 1 ? 1 : -1);
      updateData = { likes: newLikesValue >= 0 ? newLikesValue : meal.likes };
    } else if (actionType === 'emojis') {
      const newEmojisValue = meal.emojis + (newActionValue === 1 ? 1 : -1);
      updateData = {
        emojis: newEmojisValue >= 0 ? newEmojisValue : meal.emojis,
      };
    }

    await prisma.meal.update({
      where: { id },
      data: updateData,
    });

    return new Response(
      JSON.stringify({ message: 'تم التعديل بنجاح', newActionValue }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error updating meal:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    console.log('id', id);

    // Check if the meal exists
    const mealExists = await prisma.meal.findUnique({
      where: { id },
    });

    if (!mealExists) {
      return new Response(JSON.stringify({ error: 'Meal not found' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    await prisma.$transaction(async (prisma) => {
      // Check and delete associated hearts
      const heartsExist = await prisma.heart.findMany({
        where: { mealId: id },
      });
      if (heartsExist.length > 0) {
        await prisma.heart.deleteMany({
          where: { mealId: id },
        });
      }

      // Check and delete associated likes
      const likesExist = await prisma.like.findMany({
        where: { mealId: id },
      });
      if (likesExist.length > 0) {
        await prisma.like.deleteMany({
          where: { mealId: id },
        });
      }

      // Check and delete associated emojis
      const emojisExist = await prisma.emoji.findMany({
        where: { mealId: id },
      });
      if (emojisExist.length > 0) {
        await prisma.emoji.deleteMany({
          where: { mealId: id },
        });
      }

      // Delete the meal
      await prisma.meal.delete({
        where: { id },
      });
    });

    return new Response(
      JSON.stringify({
        message: 'تم الحذف بنجاح ✔',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('حدث خطأ ما 😐', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
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
