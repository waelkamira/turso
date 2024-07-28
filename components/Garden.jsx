'use client';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from './Context';
import Loading from './Loading';

export default function TheGarden() {
  const { myRecipes } = useContext(inputsContext);
  const [icons, setIcons] = useState([]);
  const [userRecipesCount, setUserRecipesCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchUserRecipesAndIcons();
  }, [myRecipes, pageNumber]);

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
        <div className="bg-four p-1 m-2 rounded-lg overflow-hidden" key={i}>
          <div className="relative size-[62px] transition-all duration-200 hover:scale-110">
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
          className="flex justify-center items-center bg-four m-1 rounded-lg"
          key={i}
        >
          <h1 className="text-4xl h-full w-full text-center p-1 sm:p-4">🥝</h1>
        </div>
      );
    }

    return elements;
  };

  return (
    <div className="text-white">
      {isLoading && <Loading />}
      {!isLoading && icons.length === 0 && <Loading />}
      {!isLoading && icons.length > 0 && (
        <div className="flex flex-wrap justify-center items-center bg-one rounded-lg size-[270px]">
          {renderIconsAndPlaceholders()}
        </div>
      )}
      {/* <div className="flex items-center justify-around text-white mt-4">
        {pageNumber > 1 && (
          <button
            className="flex items-center justify-around cursor-pointer"
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <h1 className="text-white text-sm sm:text-lg mt-2 sm:font-bold">
              الصفحة السابقة
            </h1>
          </button>
        )}
        {icons.length === 9 && (
          <button
            className="flex items-center justify-around cursor-pointer"
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <h1 className="text-white text-sm sm:text-lg mt-2 sm:font-bold">
              الصفحة التالية
            </h1>
          </button>
        )}
      </div> */}
    </div>
  );
}
