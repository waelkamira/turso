'use client';
import Image from 'next/image';
import React from 'react';
import { useKeenSlider } from 'keen-slider/react';
import 'keen-slider/keen-slider.min.css';
import { useRouter } from 'next/navigation';
const animation = { duration: 50000, easing: (t) => t };

const smallSize = [
  {
    name: 'وجبة رئيسية',

    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716946/cooking/1_trrjyx.png',
  },
  {
    name: 'معجنات',

    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718726082/huap39y7d4csoxckmshu.png',
  },
  {
    name: 'شوربات',

    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716946/cooking/3_dj2pgz.png',
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
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716946/cooking/5_os6okj.png',
  },
  {
    name: 'عصائر و مشروبات',
    image:
      'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718718789/cooking/xtg1v4qttyutalljjt2x.png',
  },
];

export default function Categories() {
  const router = useRouter();

  const [sliderRef] = useKeenSlider({
    loop: true,
    renderMode: 'performance',
    drag: false,
    created(s) {
      s.moveToIdx(5, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details?.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details?.abs + 5, true, animation);
    },
  });
  return (
    <div className="w-full xl:w-1/3 h-full rounded-lg bg-four">
      <div className="xl:hidden">
        <hr className="w-full h-1 m-0 p-0 bg-white border border-white rounded-full" />
        <div ref={sliderRef} className=" keen-slider ">
          {smallSize.map((category, index) => (
            <div
              key={index}
              className="keen-slider__slide flex flex-col gap-2 justify-center items-center bg-four rounded-lg cursor-pointer h-full "
              onClick={() => router.push(`?searchedCategory=${category?.name}`)}
            >
              <div className="relative border-2 border-four mt-4 w-52 h-24 sm:w-72 sm:h-32 md:w-80 md:h-44 lg:w-[500px] lg:h-62 xl:w-[900px]  rounded-lg overflow-hidden hover:scale-[101%] transition-all duration-500">
                <Image
                  src={category.image}
                  layout="fill"
                  objectFit="cover"
                  alt="photo"
                />
              </div>
              <h1 className="text-md md:text-lg text-center rounded-full p-2 text-white mx-4 font-semibold w-full select-none">
                {category.name}
              </h1>
            </div>
          ))}
        </div>
        <hr className="w-full h-1 m-0 p-0 bg-white border border-white rounded-full" />
      </div>
    </div>
  );
}
