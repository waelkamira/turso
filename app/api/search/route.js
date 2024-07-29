import { NextResponse } from 'next/server';
import prisma from '../../../lib/PrismaClient';

export async function GET(req) {
  await prisma.$connect(); // التأكد من أن Prisma جاهزة

  const { searchParams } = new URL(req.url, 'http://localhost');
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const mealName = searchParams.get('mealName') || '';
  const selectedValue = searchParams.get('selectedValue') || '';

  const whereConditions = {};

  if (mealName) {
    whereConditions.mealName = {
      contains: mealName,
    };
  }

  if (selectedValue) {
    whereConditions.selectedValue = {
      contains: selectedValue,
    };
  }

  try {
    const meals = await prisma.meal.findMany({
      where: whereConditions,
      skip: (page - 1) * limit,
      take: limit,
    });

    return NextResponse.json(meals, { status: 200 });
  } catch (error) {
    console.error('Error fetching meals:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
