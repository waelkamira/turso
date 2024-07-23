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

    // Find the existing like record
    const existingLike = await prisma.like.findFirst({
      where: {
        userEmail: email,
        mealId: mealId,
      },
    });

    if (existingLike) {
      // Delete the existing like record and decrement the likes count
      await prisma.$transaction([
        prisma.like.delete({
          where: {
            id: existingLike.id,
          },
        }),
        prisma.meal.update({
          where: { id: mealId },
          data: {
            likes: {
              decrement: 1,
            },
          },
        }),
      ]);
      return new Response(JSON.stringify({ message: 'Like removed' }), {
        status: 200,
      });
    } else {
      // Create a new like record and increment the likes count
      await prisma.$transaction([
        prisma.like.create({
          data: {
            userEmail: email,
            mealId: mealId,
          },
        }),
        prisma.meal.update({
          where: { id: mealId },
          data: {
            likes: {
              increment: 1,
            },
          },
        }),
      ]);
      return new Response(JSON.stringify({ message: 'Like added' }), {
        status: 201,
      });
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
