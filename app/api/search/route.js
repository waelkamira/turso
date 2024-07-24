import prisma from '../../../lib/PrismaClient';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const mealName = searchParams.get('mealName') || '';
  const selectedValue = searchParams.get('selectedValue') || '';

  const whereConditions = [];

  if (mealName) {
    whereConditions.push({
      mealName: {
        contains: mealName,
      },
    });
  }

  if (selectedValue) {
    whereConditions.push({
      selectedValue: {
        contains: selectedValue,
      },
    });
  }

  try {
    const meals = await prisma.meal.findMany({
      where: {
        AND: whereConditions,
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    return new Response(JSON.stringify(meals), { status: 200 });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
