'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { RxCross2 } from 'react-icons/rx';
import CookingForm from '../../components/CookingForm';
import { TbArrowBigLeftLinesFilled } from 'react-icons/tb';
import { signIn, useSession } from 'next-auth/react';
import Button from '../../components/Button';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import ImageUpload from '../../components/ImageUpload';
import UploadingAndDisplayingImage from '../../components/UploadingAndDisplayingImage';

export default function NewRecipe() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const session = useSession();
  return (
    <div
      className="relative flex justify-center items-start gap-4 overflow-auto w-full h-full border border-five xl:p-8 bg-four  right-0 top-0 2xl:-top-8 rounded-lg z-50"
      onClick={() => setIsVisible(false)}
    >
      <div className="absolute flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
        <TfiMenuAlt
          className=" p-1 rounded-lg text-4xl lg:text-5xl text-one cursor-pointer z-50  animate-pulse"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        />
        {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
      </div>
      <div
        className={
          (session?.status === 'unauthenticated' ? 'h-fit' : 'h-fit ') +
          ' relative border border-one rounded-lg w-full 2xl:w-2/3 flex flex-col items-start justify-center sm:flex-row top-0 overflow-hidden'
        }
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" w-full h-full flex flex-col items-center justify-start rounded-lg grow z-40 ">
          <div className="relative h-44 sm:h-72 lg:h-96 w-full ">
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
          <BackButton className="z-50 bg-one" />

          {session?.status === 'unauthenticated' && (
            <div className="p-4 bg-four rounded-lg m-2 md:m-8 border border-one text-center">
              <h1 className="text-lg md:text-2xl p-2  text-white">
                يجب عليك تسجيل الدخول أولا لكي تتمكن من إنشاء وصفة جديدة
              </h1>
              <Link href={'/login'}>
                {' '}
                <Button title={'تسجيل الدخول'} />
              </Link>{' '}
            </div>
          )}
          {session?.status === 'authenticated' && (
            <div className="w-full">
              <div className="flex justify-center items-center w-full px-8">
                <TbArrowBigLeftLinesFilled className="hidden xl:block text-one text-5xl mx-32 animate-pulse transition-all duration-300" />
                {/* <ImageUpload /> */}
                <UploadingAndDisplayingImage />
              </div>
              <CookingForm
                setIsVisible={setIsVisible}
                isVisible={isVisible}
                cancel={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
