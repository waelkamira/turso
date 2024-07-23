'use client';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { inputsContext } from './Context';
import Loading from './Loading';

export default function TheGarden() {
  const { myRecipes } = useContext(inputsContext);
  const [icons, setIcons] = useState([]);
  const [userRecipes, setUserRecipes] = useState([]);

  useEffect(() => {
    fetchUserRecipes();
  }, [myRecipes]);

  const fetchUserRecipes = async () => {
    const response = await fetch('/api/allCookingRecipes');
    const json = await response?.json();

    if (response?.ok) {
      if (typeof window !== 'undefined') {
        const userData = JSON?.parse(localStorage.getItem('CurrentUser'));
        const email = userData?.email;
        const findUserRecipes = json?.filter(
          (item) => item?.createdBy === email
        );
        setUserRecipes(findUserRecipes);

        //? هذه الدالة لجلب كل الايقونات من الباك اند
        const res = await fetch('/api/getIcons');
        const data = await res?.json();
        if (res.ok) {
          setIcons(data);
        }
      }
    }
  };

  const numberOfSquares = 9 - userRecipes?.length;
  const arr = [];
  const result = () => {
    for (let i = 0; i < numberOfSquares; i++) {
      arr.push(
        <div className="flex justify-center items-center size-[71px] bg-four m-2 rounded-lg text-center ">
          <h1 className="text-4xl">🍕</h1>
        </div>
      );
    }
    return arr;
  };

  return (
    <div className=" text-white ">
      {icons?.length === 0 && <Loading />}
      {icons?.length > 0 && (
        <div className="flex flex-wrap justify-center items-center bg-one rounded-lg size-[270px]">
          {icons?.length > 0 &&
            icons
              ?.slice(0, userRecipes?.length <= 9 ? userRecipes?.length : 9)
              ?.map((icon, index) => (
                <div
                  className="bg-four p-1 m-2 rounded-lg overflow-hidden"
                  key={index}
                >
                  <div
                    className="relative size-[62px] transition-all duration-200 hover:scale-110"
                    key={index}
                  >
                    <Image
                      src={icon}
                      layout="fill"
                      objectFit="contain"
                      alt="icon"
                    />
                  </div>
                </div>
              ))}
          {result()}
        </div>
      )}
    </div>
  );
}
