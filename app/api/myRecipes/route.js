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
    const session = await getServerSession(authOptions);
    const email = session?.user?.email || '';

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Build the query object
    const query = {};
    if (email) {
      query.createdBy = email;
    }

    // Fetch the meals and related users
    const allCookingRecipes = await prisma.meal.findMany({
      where: Object.keys(query).length ? query : undefined,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        likes: true,
        emojis: true,
        hearts: true,
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
