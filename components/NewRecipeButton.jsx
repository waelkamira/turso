'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import ImageUpload from './ImageUpload';
import CookingForm from './CookingForm';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { signIn, useSession } from 'next-auth/react';
import Button from './Button';
import Link from 'next/link';
import UploadingAndDisplayingImage from './UploadingAndDisplayingImage';

export default function NewRecipeButton() {
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();

  return (
    <div className="w-full rounded-lg z-50 ">
      <Button
        title={'إنشاء وصفة جديدة'}
        style={' '}
        onClick={() => setIsVisible(true)}
      />

      {isVisible && (
        <div
          className="absolute flex justify-center items-start gap-4 overflow-auto w-full h-full border md:p-8 bg-four/90 border-five right-0 top-0 2xl:-top-8 rounded-lg z-50"
          onClick={() => setIsVisible(false)}
        >
          <div
            className="absolute top-2 right-2 sm:top-16 sm:right-16 flex justify-center items-center z-50 bg-five hover:bg-one cursor-pointer h-fit px-4 py-1 text-white font-semibold rounded-lg hover:scale-105 shadow-lg "
            onClick={() => setIsVisible(false)}
          >
            <h1 className="tex-sm">إغلاق</h1>
            <RxCross2 className="text-xl" />
          </div>
          <div
            className={
              (session?.status === 'unauthenticated'
                ? 'h-[700px]'
                : 'h-[2400px] sm:h-[2350px] lg:h-[3000px]') +
              ' relative w-full 2xl:w-2/3 flex flex-col items-start justify-center sm:flex-row 2xl:my-8 top-0 z-40 overflow-hidden border border-one '
            }
            onClick={(e) => e.stopPropagation()}
          >
            {/* <div
              className={
                (session?.status === 'authenticated' ? 'h-full' : 'h-[700px]') +
                ' relative border border-one w-full top-0 flex items-start justify-start rounded-lg overflow-hidden bg-one'
              }
            >
              <Image
                src={
                  'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718959983/background_uzv9vh.png'
                }
                layout="fill"
                objectFit={'cover'}
                alt="photo"
                priority
              />
            </div> */}

            <div className="absolute w-full h-full flex flex-col items-center justify-start rounded-lg grow z-50 bg-four ">
              <div className="relative h-44 sm:h-72 lg:h-[600px] w-full ">
                <Image
                  src={
                    'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718994271/cooking/yrcziegsjcyzwszl4bjh.png'
                  }
                  fill
                  alt="decoration"
                  priority
                  className="m-0"
                />
              </div>
              {session?.status === 'unauthenticated' && (
                <div className="p-4 bg-four rounded-lg m-2 md:m-8 border border-one text-center">
                  <h1 className="text-lg md:text-2xl p-2  text-white">
                    يجب عليك تسجيل الدخول أولا لكي تتمكن من إنشاء وصفة جديدة
                  </h1>{' '}
                  <Button title={'تسجيل الدخول'} path={'/login'} style={' '} />
                </div>
              )}
              {session?.status === 'authenticated' && (
                <div className="w-full">
                  <div className="flex justify-center items-center w-full px-8 mt-8">
                    {/* <ImageUpload /> */}
                    <UploadingAndDisplayingImage />
                  </div>
                  <CookingForm
                    setIsVisible={setIsVisible}
                    isVisible={isVisible}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
