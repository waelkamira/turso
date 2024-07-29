'use client';
import React, { useEffect, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import SmallItem from './SmallItem';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
} from 'react-icons/md';
import { Suspense } from 'react';
import Button from './Button';

// Function to normalize Arabic text
const normalizeArabic = (text) => {
  if (!text) return '';
  return text.replace(/[أ]/g, 'ا');
};

export default function SearchBar() {
  const [pageNumber, setPageNumber] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [searchByCategory, setSearchByCategory] = useState([]);
  const [searchedWord, setSearchedWord] = useState('');
  const [searchedValues, setSearchedValues] = useState([]);
  const searchCategory = useSearchParams();
  const searchedCategory = searchCategory.get('searchedCategory');
  const router = useRouter();

  useEffect(() => {
    search();
  }, [searchedWord, searchedCategory, pageNumber]);

  const search = async () => {
    const queryParams = new URLSearchParams({
      page: pageNumber.toString(),
      limit: '10',
    });

    const normalizedSearchedWord = normalizeArabic(searchedWord);
    const normalizedCategory = normalizeArabic(searchedCategory);

    if (normalizedSearchedWord) {
      queryParams.append('mealName', normalizedSearchedWord);
    }

    if (normalizedCategory) {
      queryParams.append('selectedValue', normalizedCategory);
    }

    const res = await fetch(`/api/search?${queryParams.toString()}`);
    const json = await res?.json();

    if (!normalizedSearchedWord && !normalizedCategory) {
      setIsVisible(false);
    }

    if (normalizedSearchedWord) {
      setIsVisible(true);
      setSearchedValues(json);
      setSearchByCategory([]); // Clear category search results
    }

    if (normalizedCategory) {
      setIsVisible(true);
      setSearchByCategory(json);
      setSearchedValues([]); // Clear text search results
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setSearchByCategory([]);
    setSearchedValues([]);
    setSearchedWord('');
    router.push('/');
  };

  return (
    <Suspense>
      <div
        className={
          (searchedWord || searchedCategory
            ? 'absolute z-50 top-4 left-0 h-screen overflow-scroll'
            : '') +
          ' flex flex-col items-start justify-center w-full lg:mt-8 bg-four rounded-lg'
        }
      >
        <div className="flex flex-col justify-center items-center sm:flex-row gap-4 w-full">
          {!searchedCategory && !searchedWord && (
            <div className="relative w-full xl:w-96 h-52 overflow-hidden">
              <Image
                priority
                src="https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716956/cooking/logo1_uwwlyk.png"
                layout="fill"
                objectFit="contain"
                alt="photo"
              />
            </div>
          )}
          <div className="relative w-full sm:px-4 bg-four">
            <input
              value={searchedWord}
              onChange={(e) => setSearchedWord(e.target.value)}
              autoFocus
              type="text"
              id="search_meal"
              name="search_meal"
              placeholder="ابحث عن وصفة طبخ   ..."
              className="w-full rounded-full border-2 text-lg md:text-xl placeholder:text-lg py-2 px-10 outline-2 placeholder:px-2 focus:outline-one text-right"
            />
            <div className="absolute top-3 md:top-4 right-4">
              <IoIosSearch className="text-one font-bold size-5 mr-1 mt-1 sm:mr-4 sm:mt-0" />
            </div>
          </div>
        </div>
        {isVisible && (
          <div className="sticky top-0 flex flex-row-reverse justify-between items-center mt-1 w-full z-50 bg-four p-4">
            <button
              onClick={handleClose}
              className="py-1 px-4 text-white bg-five w-24 rounded-full sm:text-lg hover:bg-one hover:scale-55"
            >
              إغلاق
            </button>
            <h1 className="text-sm sm:text-2xl text-nowrap mx-2 font-bold text-white">
              نتائج البحث:
            </h1>
          </div>
        )}
        {isVisible && (
          <div className="relative w-full flex flex-col items-center justify-start p-2 overflow-y-auto h-screen bg-four rounded-lg content-center">
            {searchedWord &&
              searchedValues.length > 0 &&
              searchedValues.map((recipe, index) => (
                <div className="w-full 2xl:w-2/3 " key={index}>
                  <SmallItem recipe={recipe} index={index} />
                </div>
              ))}
            {searchedCategory &&
              searchByCategory.length > 0 &&
              searchByCategory.map((recipe, index) => (
                <div className="w-full 2xl:w-2/3" key={index}>
                  <SmallItem recipe={recipe} index={index} />
                </div>
              ))}
            <div className="flex items-center justify-around my-4 mt-8 w-full">
              {(searchByCategory.length >= 10 ||
                searchedValues.length >= 10) && (
                <Link href="#post1">
                  <div
                    className="flex items-center justify-around cursor-pointer"
                    onClick={() => setPageNumber(pageNumber + 1)}
                  >
                    <h1 className="text-gray-600 font-bold">الصفحة التالية</h1>
                    <MdKeyboardDoubleArrowRight className="text-2xl animate-pulse" />
                  </div>
                </Link>
              )}
              {pageNumber > 1 && (
                <Link href="#post1">
                  <div
                    className="flex items-center justify-around cursor-pointer"
                    onClick={() => setPageNumber(pageNumber - 1)}
                  >
                    <MdKeyboardDoubleArrowLeft className="text-2xl animate-pulse" />
                    <h1 className="text-gray-600 font-bold">الصفحة السابقة</h1>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </Suspense>
  );
}
