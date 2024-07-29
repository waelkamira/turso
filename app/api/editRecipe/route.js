import prisma from '../../../lib/PrismaClient';

export async function GET(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');

  await prisma.$connect();

  console.log('id', id);
  try {
    const meal = await prisma?.meal?.findUnique({
      where: { id },
    });

    return Response.json(meal);
  } catch (error) {
    console.error('Error updating meal:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      status: 500,
    });
  }
}
export async function PUT(req) {
  const url = new URL(req.url);
  const searchParams = url.searchParams;
  const id = searchParams.get('id');
  const { ...data } = await req.json();
  await prisma.$connect();

  console.log('id', id);
  try {
    const meal = await prisma.meal.update({
      where: { id },
      data: data,
    });

    return new Response(
      JSON.stringify({ message: 'تم التعديل بنجاح' }, { meal }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error updating meal:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ ما' }), {
      status: 500,
    });
  }
}
