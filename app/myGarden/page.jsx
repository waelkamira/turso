'use client';
import BackButton from '../../components/BackButton';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import Loading from '../../components/Loading';
import Button from '../../components/Button';
import LoadingPhoto from '../../components/LoadingPhoto';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import { MdKeyboardDoubleArrowLeft } from 'react-icons/md';
import Link from 'next/link';

export default function TheGarden() {
  const [pageNumber, setPageNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [icons, setIcons] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

  useEffect(() => {
    fetchUserRecipes();
  }, [pageNumber]);

  //? هذه الدالة لجلب كل وصفات المستخدم لحساب عددها و عرضع الجوائز بناء على العدد
  const fetchUserRecipes = async () => {
    const response = await fetch('/api/allCookingRecipes');
    const json = await response.json();

    if (response?.ok) {
      if (typeof window !== 'undefined') {
        const userData = JSON.parse(localStorage.getItem('CurrentUser'));
        // console.log('userData', userData);

        const email = userData?.email;
        // console.log('email', email);
        const findUserRecipes = json?.filter(
          (item) => item?.createdBy === email
        );
        setUserRecipes(findUserRecipes);

        //? هذه الدالة لجلب كل الايقونات من الباك اند
        const res = await fetch('/api/getIcons');
        const data = await res.json();
        if (res.ok) {
          const startPage = (pageNumber - 1) * 12;
          const endPage = startPage + 12;
          setIcons(data?.slice(startPage, endPage));
        }
      }
    }
  };

  const numberOfSquares = 12 - userRecipes?.length;
  // const numberOfCubs = 0;
  const arr = [];
  const result = () => {
    for (let i = 0; i < numberOfSquares; i++) {
      arr.push(
        <div className="flex justify-center items-center bg-four m-1 rounded-lg">
          <h1 className="text-5xl h-full w-full text-center p-2 sm:p-4">🥝</h1>
        </div>
      );
    }
    return arr;
  };

  // console.log('userRecipes', userRecipes);

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
        <h1 className="grow text-lg lg:text-2xl w-full text-white ">
          الجوائز التي ربحتها نتيجة نشر
          <span className="text-one"> {userRecipes?.length}</span> وصفات
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
        {icons?.length === 0 && (
          <Loading
            myMessage={
              'لم تربح أي جائزة بعد لأنك لم تقم بنشر أي وصفة طبخ حتى الأن 😉'
            }
          />
        )}
        {icons?.length > 0 && (
          <div className="grid grid-cols-3 w-full sm:w-2/3 xl:w-1/3 h-full bg-one rounded-lg p-4">
            {icons?.length > 0 &&
              icons?.slice(0, userRecipes?.length)?.map((icon, index) => (
                <div
                  className="flex justify-center p-2 rounded-lg bg-four overflow-hidden m-1"
                  key={index}
                >
                  <div
                    className="relative size-[50px] sm:size-[70px] transition-all duration-300 hover:scale-112 cursor-pointer"
                    key={index}
                  >
                    {!icon && <LoadingPhoto />}
                    {icon && (
                      <Image
                        src={icon}
                        layout="fill"
                        objectFit="contain"
                        alt="icon"
                      />
                    )}
                  </div>
                </div>
              ))}
            {result()}
          </div>
        )}
      </div>
      <div className="flex items-center justify-around text-white">
        {icons?.length >= 12 && (
          <Link href={'#post1'}>
            <div
              className="flex items-center justify-around cursor-pointer"
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              <h1 className="text-white text-sm sm:text-lg mt-2 sm:font-bold">
                الصفحة التالية
              </h1>
              <MdKeyboardDoubleArrowRight className="text-2xl animate-pulse" />
            </div>
          </Link>
        )}
        {pageNumber > 1 && (
          <Link href={'#post1'}>
            <div
              className="flex items-center justify-around cursor-pointer"
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <MdKeyboardDoubleArrowLeft className="text-2xl animate-pulse" />
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
