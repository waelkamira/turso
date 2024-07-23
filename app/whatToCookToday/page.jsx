'use client';
import SmallItem from '../../components/SmallItem';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import Button from '../../components/Button';
import Loading from '../../components/Loading';

export default function WhatToCookToday() {
  const [isOpen, setIsOpen] = useState(false); // State to control sidebar menu visibility
  const [randomCookingRecipes, setRandomCookingRecipes] = useState([]); // State to store the fetched recipes

  useEffect(() => {
    fetchAllMainCookingRecipes(); // Fetch recipes when the component mounts
  }, []);

  // Fetch recipes from the API with a limit of 3 and filter by 'selectedValue'
  const fetchAllMainCookingRecipes = async () => {
    const response = await fetch(
      '/api/allCookingRecipes?limit=3&selectedValue=وجبة رئيسية'
    );
    const json = await response?.json();
    if (response.ok) {
      setRandomCookingRecipes(json); // Update state with fetched recipes
    }
  };

  // Shuffle the array of recipes and set the state with the first 3 recipes
  function shuffleArray(array) {
    const shuffledArray = [...array]; // Make a copy of the array to avoid mutating the original state
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ]; // Swap elements
    }
    setRandomCookingRecipes(shuffledArray.slice(0, 3)); // Update state with the first 3 shuffled recipes
  }

  return (
    <div className="relative w-full bg-four h-full p-4 lg:p-8 rounded-lg">
      <div className="hidden xl:block relative w-full h-24 sm:h-[200px] rounded-lg overflow-hidden shadow-lg shadow-one">
        <Image
          priority
          src={
            'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716949/cooking/66_pkcjqt.png'
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
      <div className=" w-full gap-4 my-8">
        <h1 className="text-white sm:text-lg">
          اضغط هنا للحصول على ثلاث أفكار جديدة لطبخة اليوم
        </h1>
        <Button
          onClick={() => shuffleArray(randomCookingRecipes)} // Shuffle recipes on button click
          title={'اقتراح أفكار جديدة'}
          style={'text-white bg-one rounded-full p-2 text-lg w-full lg:w-1/3'}
        />

        <BackButton />
        <div className="absolute flex flex-col items-start gap-2 z-50 top-2 right-2 sm:top-4 sm:right-4 xl:right-12 xl:top-12 ">
          <TfiMenuAlt
            className=" p-1 rounded-lg text-4xl lg:text-5xl text-one cursor-pointer z-50  animate-pulse"
            onClick={() => {
              setIsOpen(!isOpen); // Toggle sidebar menu visibility
            }}
          />
          {isOpen && <SideBarMenu setIsOpen={setIsOpen} />}
        </div>
      </div>
      <h1 className="grow text-sm sm:text-lg lg:text-2xl w-full text-white text-center select-none">
        الأفكار المقترحة لطبخة اليوم
      </h1>
      <div className="my-8">
        {randomCookingRecipes?.length === 0 && <Loading />}
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 justify-center items-center w-full ">
          {randomCookingRecipes?.length > 0 &&
            randomCookingRecipes.map((recipe, index) => (
              <div className="relative " key={index}>
                <SmallItem recipe={recipe} index={index} show={false} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
