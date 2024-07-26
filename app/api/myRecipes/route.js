import { NextResponse } from 'next/server';
import prisma from '../../../lib/PrismaClient';

export async function GET(req) {
  // Extract the search parameters outside the try/catch block
  const { searchParams } = new URL(req.url, 'http://localhost');
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = parseInt(searchParams.get('limit')) || 5;
  const email = searchParams.get('email') || '';
  console.log('email =========', email);

  try {
    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Build the query object
    const query = {};
    if (email) {
      query.createdBy = email;
    } else {
      return NextResponse.json({ message: 'لا يوجد نتائج لعرضها' });
    }

    // Fetch the meals and related users
    const allCookingRecipes = await prisma.meal?.findMany({
      where: Object.keys(query).length ? query : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });

    return NextResponse.json(allCookingRecipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
