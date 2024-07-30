import { NextResponse } from 'next/server';
import prisma from '../../../lib/PrismaClient';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET(req) {
  await prisma.$connect(); // Ensure Prisma is ready

  const { searchParams } = new URL(req.url, 'http://localhost');
  const email = searchParams.get('email') || '';
  const page = parseInt(searchParams.get('page')) || 1;
  const limit = 9; // Number of icons per page

  try {
    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    // Fetch the count of meals created by the user
    const userRecipesCount = await prisma.meal.count({
      where: { createdBy: email },
    });

    // Fetch the icons from Cloudinary
    const folderName = 'items'; // Replace with your folder name
    let result;
    if (page === 1) {
      result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderName,
        max_results: limit,
      });
    } else {
      const previousPageCursor = await getPreviousPageCursor(page, limit);
      result = await cloudinary.api.resources({
        type: 'upload',
        prefix: folderName,
        max_results: limit,
        next_cursor: previousPageCursor,
      });
    }

    const icons = result.resources.map((resource) => resource.secure_url);

    // Combine the count and icons
    const userIcons = { count: userRecipesCount, icons };

    return NextResponse.json(userIcons);
  } catch (error) {
    console.error('Error fetching user icons:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Function to get the next_cursor for the previous page
async function getPreviousPageCursor(page, limit) {
  let previousPageCursor = null;
  for (let i = 1; i < page; i++) {
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'items',
      max_results: limit,
      next_cursor: previousPageCursor,
    });
    previousPageCursor = result.next_cursor;
  }
  return previousPageCursor;
}
