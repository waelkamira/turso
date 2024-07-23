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

    // Check if the record exists in the emojis table
    const emojiRecord = await prisma.emoji.findFirst({
      where: {
        userEmail: email,
        mealId: mealId,
      },
    });

    return new Response(JSON.stringify({ exists: !!emojiRecord }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error checking emoji record:', error);
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

    // Log the email to ensure it's correct
    // console.log('Email from session:', email);

    // Find the existing emoji record
    const existingEmoji = await prisma.emoji.findFirst({
      where: {
        userEmail: email,
        mealId: mealId,
      },
    });

    if (existingEmoji) {
      // Delete the existing emoji record and decrement the emojis count
      await prisma.$transaction([
        prisma.emoji.delete({
          where: {
            id: existingEmoji.id,
          },
        }),
        prisma.meal.update({
          where: { id: mealId },
          data: {
            emojis: {
              decrement: 1,
            },
          },
        }),
      ]);
      return new Response(JSON.stringify({ message: 'غير لذيذ' }), {
        status: 200,
      });
    } else {
      // Create a new emoji record and increment the emojis count
      await prisma.$transaction([
        prisma.emoji.create({
          data: {
            userEmail: email,
            mealId: mealId,
          },
        }),
        prisma.meal.update({
          where: { id: mealId },
          data: {
            emojis: {
              increment: 1,
            },
          },
        }),
      ]);
      return new Response(JSON.stringify({ message: 'لذيذ' }), {
        status: 201,
      });
    }
  } catch (error) {
    console.error('Error toggling emoji:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
}
