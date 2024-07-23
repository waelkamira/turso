import prisma from '../../../../lib/PrismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../authOptions/route';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    });
  }

  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;
    const mealId = parseInt(searchParams.get('mealId'), 10);

    if (isNaN(mealId)) {
      return new Response(JSON.stringify({ error: 'Invalid meal ID' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log('mealId:', mealId, 'email:', email);

    // Check if the record exists in the hearts table
    const heartRecord = await prisma.heart.findFirst({
      where: {
        userEmail: email,
        mealId: mealId,
      },
    });

    return new Response(JSON.stringify({ exists: !!heartRecord }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error checking heart record:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
export async function POST(req) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 401,
    });
  }

  try {
    const data = await req.json();
    const mealId = data.mealId;

    // Find the existing heart record
    const existingHeart = await prisma.heart.findFirst({
      where: {
        userEmail: email,
        mealId: mealId,
      },
    });

    if (existingHeart) {
      // Delete the existing heart record and decrement the hearts count
      await prisma.$transaction([
        prisma.heart.delete({
          where: {
            id: existingHeart.id,
          },
        }),
        prisma.meal.update({
          where: { id: mealId },
          data: {
            hearts: {
              decrement: 1,
            },
          },
        }),
      ]);
      return new Response(
        JSON.stringify({ message: 'تم إزالة الوصفة من قائمتك المفضلة' }),
        {
          status: 200,
        }
      );
    } else {
      // Create a new heart record and increment the hearts count
      await prisma.$transaction([
        prisma.heart.create({
          data: {
            userEmail: email,
            mealId: mealId,
          },
        }),
        prisma.meal.update({
          where: { id: mealId },
          data: {
            hearts: {
              increment: 1,
            },
          },
        }),
      ]);
      return new Response(JSON.stringify({ message: 'تم حفظ الوصفة' }), {
        status: 201,
      });
    }
  } catch (error) {
    console.error('حدث خطأ ما:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
