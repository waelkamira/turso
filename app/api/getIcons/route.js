import { v2 as cloudinary } from 'cloudinary';

//? Cloudinary هذه الطريقة لجلب كل الصور من فولدر معين على سيرفر
// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_key,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET() {
  //? يجب وضع اسم الفولدر المراد جلبه هنا
  const folderName = 'items'; // Replace with your folder name
  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: folderName,
    max_results: 500,
  });

  const imageUrls = result.resources.map((resource) => resource.secure_url);
  // console.log('imageUrls', imageUrls);
  return Response.json(imageUrls);
}
