'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { TfiMenuAlt } from 'react-icons/tfi';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import LoadingPhoto from '../../components/LoadingPhoto';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import Link from 'next/link';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';

export default function TheGarden() {
  const [pageNumber, setPageNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [icons, setIcons] = useState([]);
  const [userRecipesCount, setUserRecipesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserRecipesAndIcons(pageNumber);
  }, [pageNumber]);
  //? هذه الدالة لجلب عدد وصفات المستخدم والأيقونات
  const fetchUserRecipesAndIcons = async () => {
    if (typeof window !== 'undefined') {
      setIsLoading(true);
      const userData = JSON.parse(localStorage.getItem('CurrentUser'));
      const email = userData?.email;

      if (email) {
        const response = await fetch(
          `/api/userIcons?email=${email}&page=${pageNumber}`
        );
        const json = await response.json();

        if (response.ok) {
          setUserRecipesCount(json.count);
          setIcons(json.icons);
        }
      }
      setIsLoading(false);
    }
  };

  const renderIconsAndPlaceholders = () => {
    const elements = [];
    const iconsCount = Math.min(userRecipesCount, 9);

    for (let i = 0; i < iconsCount; i++) {
      elements.push(
        <div
          className="flex justify-center items-center bg-four p-1 m-2 rounded-lg overflow-hidden"
          key={i}
        >
          <div className="relative size-[62px] lg:size-[100px] transition-all duration-200 hover:scale-110">
            <Image
              src={icons[i]}
              layout="fill"
              objectFit="contain"
              alt="icon"
            />
          </div>
        </div>
      );
    }

    for (let i = iconsCount; i < 9; i++) {
      elements.push(
        <div
          className="flex justify-center bg-four p-1 m-2 rounded-lg overflow-hidden"
          key={i}
        >
          <h1 className="text-3xl lg:text-5xl  h-full w-full text-center p-3 sm:p-8 transition-all duration-200 hover:scale-110">
            🥝
          </h1>
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="relative w-full bg-four h-full p-4 lg:p-8 rounded-lg">
      <div className="hidden xl:block relative w-full h-24 sm:h-[200px] rounded-lg overflow-hidden shadow-lg shadow-one">
        <Image
          priority
          src={
            'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716950/cooking/99_onuwhf.png'
          }
          layout="fill"
          objectFit="cover"
          alt="photo"
        />
      </div>
      <div className="relative w-full h-52 overflow-hidden xl:mt-8">
        <Image
          priority
          src={
            'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716956/cooking/logo1_uwwlyk.png'
          }
          layout="fill"
          objectFit="contain"
          alt="photo"
        />
      </div>
      <div className="flex flex-col justify-start items-center w-full gap-4 my-8">
        <h1 className="grow text-lg lg:text-2xl w-full text-white">
          الجوائز التي ربحتها نتيجة نشر
          <span className="text-one"> {userRecipesCount}</span> وصفات
        </h1>
        <div className="w-full sm:w-1/3 gap-4 my-8">
          <Button title={'إنشاء وصفة جديدة'} style={' '} path="/newRecipe" />
        </div>
        <BackButton />
        <div className="absolute flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
          <TfiMenuAlt
            className=" p-1 rounded-lg text-4xl lg:text-5xl text-one cursor-pointer z-50  animate-pulse"
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          />
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
        </div>
      </div>
      <div className="flex justify-center items-center text-white w-full h-full ">
        {isLoading && <Loading myMessage={'جاري التحميل...'} />}
        {!isLoading && icons.length === 0 && (
          <Loading
            myMessage={
              'لم تربح أي جائزة بعد لأنك لم تقم بنشر أي وصفة طبخ حتى الأن 😉'
            }
          />
        )}
        {!isLoading && icons.length > 0 && (
          <div className="grid grid-cols-3 w-full sm:w-2/3 xl:w-3/5 h-full bg-one rounded-lg p-4">
            {renderIconsAndPlaceholders()}
          </div>
        )}
      </div>
      <div className="flex items-center justify-around text-white text-center">
        {userRecipesCount > pageNumber * 9 && (
          <Link href={'#post1'}>
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              <h1 className="text-white text-sm sm:text-lg mt-2 sm:font-bold">
                الصفحة التالية
              </h1>
              <MdKeyboardDoubleArrowRight className="text-2xl animate-pulse text-one select-none text-center h-full" />
            </div>
          </Link>
        )}
        {pageNumber > 1 && (
          <Link href={'#post1'}>
            <div
              className="flex items-center justify-center cursor-pointer"
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <MdKeyboardDoubleArrowLeft className="text-2xl animate-pulse text-one select-none text-center h-full" />
              <h1 className="text-white text-sm sm:text-lg mt-2 sm:font-bold">
                الصفحة السابقة
              </h1>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
