import prisma from '../../../lib/PrismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../authOptions/route';

// معالج طلب GET
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 5;
    const mealId = searchParams.get('mealId') || '';
    const session = await getServerSession(authOptions);
    const email = session?.user?.email;
    const nonEmail = searchParams.get('nonEmail');
    const skip = (page - 1) * limit;

    const query = {};
    if (email && !nonEmail) {
      query.userEmail = email;
    }
    if (mealId) {
      query.mealId = mealId;
    }

    // Fetch action records from the database
    const actionRecords = await prisma.action.findMany({
      where: query,
      skip,
      take: limit,
    });

    return new Response(JSON.stringify(actionRecords));
  } catch (error) {
    console.error('Error fetching action records:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// معالج طلب POST
export async function POST(req) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      status: 401,
    });
  }

  try {
    const data = await req.json();
    const mealId = data.mealId;
    const actionType = data.actionType;

    if (!['likes', 'hearts', 'emojis'].includes(actionType)) {
      return new Response(JSON.stringify({ error: 'Invalid action type' }), {
        status: 400,
      });
    }

    const meal = await prisma.meal.findUnique({ where: { id: mealId } });

    const existingAction = await prisma.action.findFirst({
      where: {
        userEmail: email,
        mealId: mealId,
      },
    });

    let newActionValue;
    if (existingAction) {
      newActionValue = existingAction[actionType] === 1 ? 0 : 1;

      if (newActionValue === 0) {
        await prisma.action.delete({
          where: { id: existingAction.id },
        });
      } else {
        await prisma.action.update({
          where: { id: existingAction.id },
          data: { [actionType]: newActionValue },
        });
      }
    } else {
      newActionValue = 1;
      const newActionData = {
        userEmail: email,
        mealId: mealId,
        likes: 0,
        hearts: 0,
        emojis: 0,
      };
      newActionData[actionType] = newActionValue;

      await prisma.action.create({
        data: newActionData,
      });
    }

    // تحديث عدد الـ hearts في الـ meal
    if (actionType === 'hearts') {
      const increment = newActionValue === 1 ? 1 : -1;
      if (meal) {
        const newHeartsValue = meal.hearts + increment;
        await prisma.meal.update({
          where: { id: mealId },
          data: {
            hearts: newHeartsValue >= 0 ? newHeartsValue : meal.hearts,
          },
        });
      }
    }

    let message = 'Action updated successfully';
    if (actionType === 'likes') {
      message = newActionValue
        ? 'تم الاعجاب بهذه الوصفة'
        : 'تم ازالة الاعجاب بهذه الوصفة';
    } else if (actionType === 'hearts') {
      message = newActionValue
        ? 'تم حفظ الوصفة في قائمتك المفضلة'
        : 'تم إزالة الوصفة من قائمتك المفضلة';
    } else if (actionType === 'emojis') {
      message = newActionValue ? 'لذيذ' : 'ليس لذيذ';
    }

    return new Response(JSON.stringify({ message, newActionValue }));
  } catch (error) {
    console.error('Error updating action:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// import prisma from '../../../../lib/PrismaClient';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../../authOptions/route';

// export async function GET(req) {
//   try {
//     const url = new URL(req.url);
//     const searchParams = url.searchParams;
//     const page = parseInt(searchParams.get('page')) || 1;
//     const limit = parseInt(searchParams.get('limit')) || 5;
//     const id = parseInt(searchParams.get('mealId')) || 0;
//     const session = await getServerSession(authOptions);
//     const nonEmail = searchParams.get('nonEmail');
//     const email = session?.user?.email;
//     const skip = (page - 1) * limit;

//     // Construct query based on email and/or mealId
//     const query = {};
//     if (email && !nonEmail) {
//       query.userEmail = email;
//     }

//     if (id) {
//       query.mealId = id;
//     }

//     console.log('query', query);
//     // Fetch heart records with pagination
//     const heartRecords = await prisma.heart.findMany({
//       where: query,
//       skip,
//       take: limit, // Fetch at most 'limit' records
//     });

//     return new Response(JSON.stringify(heartRecords), {
// //       status: 200,
//     });
//   } catch (error) {
//     console.error('Error fetching heart records:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
// //       status: 500,
//     });
//   }
// }
// export async function POST(req) {
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;

//   if (!email) {
//     return new Response(JSON.stringify({ error: 'User not authenticated' }), {
// //       status: 401,
//     });
//   }

//   try {
//     const data = await req.json();
//     const mealId = data.mealId;

//     // Find the existing heart record
//     const existingHeart = await prisma.heart.findFirst({
//       where: {
//         userEmail: email,
//         mealId: mealId,
//       },
//     });

//     if (existingHeart) {
//       // Delete the existing heart record and decrement the hearts count
//       await prisma.$transaction([
//         prisma.heart.delete({
//           where: {
//             id: existingHeart.id,
//           },
//         }),
//         prisma.meal.update({
//           where: { id: mealId },
//           data: {
//             hearts: {
//               decrement: 1,
//             },
//           },
//         }),
//       ]);
//       return new Response(
//         JSON.stringify({ message: 'تم إزالة الوصفة من قائمتك المفضلة' }),
//         {
//           status: 200,
//         }
//       );
//     } else {
//       // Create a new heart record and increment the hearts count
//       await prisma.$transaction([
//         prisma.heart.create({
//           data: {
//             userEmail: email,
//             mealId: mealId,
//           },
//         }),
//         prisma.meal.update({
//           where: { id: mealId },
//           data: {
//             hearts: {
//               increment: 1,
//             },
//           },
//         }),
//       ]);
//       return new Response(JSON.stringify({ message: 'تم حفظ الوصفة' }), {
//         status: 201,
//       });
//     }
//   } catch (error) {
//     console.error('حدث خطأ ما:', error);
//     return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
// //       status: 500,
//     });
//   }
// }
