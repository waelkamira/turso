'use client';
import Image from 'next/image';
import React from 'react';
import { useRouter } from 'next/navigation';

const smallSize = [
  {
    name: 'وجبة رئيسية',
    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716947/cooking/11_x2264c.png',
  },
  {
    name: 'معجنات',
    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716948/cooking/22_wqvvw7.png',
  },
  {
    name: 'شوربات',
    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716949/cooking/33_lkcmzq.png',
  },
  {
    name: 'مقبلات',
    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716948/cooking/7_viimv5.png',
  },
  {
    name: 'سلطات',
    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716947/cooking/6_svkguu.png',
  },
  {
    name: 'حلويات',
    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716949/cooking/55_fj72id.png',
  },
  {
    name: 'عصائر و مشروبات',
    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716950/cooking/44_fxwhfg.png',
  },
];
export default function CategoriesSlid() {
  const router = useRouter();

  return (
    <div className="hidden xl:flex flex-col items-center justify-center px-2 w-full bg-four rounded-lg ">
      <h1 className="text-lg sm:text-xl text-center py-4 mt- text-white mx-4 font-semibold w-full select-none">
        ابحث حسب الصنف
      </h1>
      {smallSize.map((category, index) => (
        <div
          className=" flex flex-col justify-center items-center rounded-full mx-4 cursor-pointer w-full "
          key={index}
        >
          <div
            className="relative border border-one w-full h-[150px] rounded-lg overflow-hidden hover:scale-[101%] transition-all duration-300 shadow-lg"
            onClick={() => router.push(`?searchedCategory=${category?.name}`)}
          >
            <Image
              src={category.image}
              layout="fill"
              objectFit="cover"
              alt="photo"
            />
          </div>
          <h1 className="text-lg sm:text-xl text-center p-2 text-white mx-4 font-ةي w-full select-none">
            {category.name}
          </h1>
        </div>
      ))}
    </div>
  );
}
