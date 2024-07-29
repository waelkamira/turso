import prisma from '../../../lib/PrismaClient';

export async function GET(req) {
  try {
    // Parse query parameters for pagination and filtering
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    const id = searchParams.get('id'); // Keep as string

    // التأكد من أن Prisma جاهزة
    await prisma.$connect();

    const meal = await prisma.meal?.findMany({
      where: { id },
    });

    return new Response(JSON.stringify(meal), {
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
