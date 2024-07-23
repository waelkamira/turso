import prisma from '../../../../lib/PrismaClient';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../authOptions/route';

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

    // Log the email to ensure it's correct
    console.log('Email from session:', email);

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
      return new Response(JSON.stringify({ message: 'Heart removed' }), {
        status: 200,
      });
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
      return new Response(JSON.stringify({ message: 'Heart added' }), {
        status: 201,
      });
    }
  } catch (error) {
    console.error('Error toggling heart:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
