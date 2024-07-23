'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState, useContext } from 'react';
import { inputsContext } from '../components/Context';
import SmallItem from '../components/SmallItem';
import Loading from '../components/Loading';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function AllCookingRecipes() {
  const [pageNumber, setPageNumber] = useState(1);
  const [allCookingRecipes, setAllCookingRecipes] = useState([]);
  const { dispatch, newRecipe, deletedRecipe } = useContext(inputsContext);
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    fetchAllCookingRecipes();
  }, [newRecipe, deletedRecipe, pageNumber]);

  async function fetchAllCookingRecipes() {
    try {
      const response = await fetch(
        `/api/allCookingRecipes?page=${pageNumber}&limit=10`
      );
      if (response.ok) {
        const json = await response.json();
        console.log('json', json);
        dispatch({ type: 'SET_RECIPES', payload: json });
        setAllCookingRecipes(json);
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
    }
  }

  return (
    <div className="flex flex-col w-full xl:w-[90%] 2xl:w-[70%] h-[1800px] sm:px-16 pt-4 sm:py-8 rounded-lg bg-seven overflow-y-auto z-10">
      {allCookingRecipes.length === 0 ? (
        <Loading />
      ) : (
        allCookingRecipes.map((recipe, index) => (
          <div key={index}>
            <SmallItem recipe={recipe} index={index} />
          </div>
        ))
      )}
      <div className="flex items-center justify-around sm:my-4 sm:mt-8">
        {allCookingRecipes.length >= 10 && (
          <div
            className="flex items-center justify-around cursor-pointer"
            onClick={() => setPageNumber(pageNumber + 1)}
          >
            <h1 className="text-gray-600 font-bold">Next Page</h1>
            <MdKeyboardDoubleArrowRight className="text-2xl animate-pulse" />
          </div>
        )}
        {pageNumber > 1 && (
          <div
            className="flex items-center justify-around cursor-pointer"
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            <MdKeyboardDoubleArrowLeft className="text-2xl animate-pulse" />
            <h1 className="text-gray-600 font-bold">Previous Page</h1>
          </div>
        )}
      </div>
    </div>
  );
}
