'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Button from './Button';
import Image from 'next/image';
import CurrentUser from '../components/CurrentUser';
import TheGarden from './Garden';
import Categories from './Categories';
import NewRecipeButton from './NewRecipeButton';
import Loading from './Loading';
import LoadingPhoto from './LoadingPhoto';

export default function SideBar() {
  const router = useRouter();
  const session = useSession();
  const [newImage, setNewImage] = useState('');
  const user = CurrentUser();
  const [userRecipeCount, setUserRecipeCount] = useState(0);

  // console.log('user', user);
  useEffect(() => {
    getTheUserRecipeCount();
    if (typeof window !== 'undefined') {
      const ima = localStorage.getItem('image');
      setNewImage(ima);
    }
  }, []);

  //? معرفة عدد الطبخات حتى يتم اظهار زر الجوائز اولا
  async function getTheUserRecipeCount() {
    const response = await fetch('/api/myRecipes');
    const json = await response?.json();
    console.log('json from sidebar', json);
    if (response.ok) {
      setUserRecipeCount(json?.count);
    }
  }

  return (
    <div className="hidden xl:block w-80 h-full border-l-[16px] border-one">
      <div
        className={
          (session?.status === 'unauthenticated' ? 'min-h-screen' : '') +
          ` w-full bg-four rounded-r-lg  h-full `
        }
      >
        {session?.status === 'authenticated' && (
          <div className="flex flex-col justify-between items-center p-4 rounded-r-lg w-full">
            <div
              className="flex justify-start items-center w-full cursor-pointer gap-2 line-clamp-1"
              onClick={() => router.push('/profile?username')}
            >
              <div className="relative size-14 overflow-hidden rounded-full">
                {!user?.image && <LoadingPhoto />}

                {user?.image && (
                  <Image src={user?.image} fill alt={user?.name} />
                )}
              </div>
              <h1 className=" text-white text-nowrap">{user?.name} </h1>
            </div>

            <div className="w-full">
              <Button
                title={'تسجيل الخروج'}
                style={' '}
                onClick={() => signOut()}
              />
            </div>
          </div>
        )}

        {session?.status === 'unauthenticated' && (
          <div className="px-4 py-8">
            <Button title={'تسجيل دخول'} style={' '} path="/login" />
          </div>
        )}
      </div>
      {session?.status === 'authenticated' && (
        <div className="w-full rounded-r-lg my-4">
          <div className="p-4 rounded-r-lg bg-four overflow-hidden my-4">
            <div className=" relative w-full h-32">
              <Image
                priority
                src={
                  'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716955/cooking/nasoh_and_bahiga_cn3e7h.png'
                }
                layout="fill"
                objectFit="contain"
                alt="photo"
              />
            </div>
            <div className="hidden lg:flex flex-col justify-between items-center w-full h-full rounded-r-lg">
              <NewRecipeButton />
            </div>

            <Button
              title={'شو أطبخ اليوم؟'}
              style={' '}
              path="/whatToCookToday"
            />

            <Button title={'طبخاتي'} style={' '} path="/myRecipes" />
            <Button title={'وصفات أعجبتني'} style={' '} path="/favoritePosts" />
            {/* {userRecipeCount > 0 && (
              <Button title={'الجوائز'} style={' '} path="/myGarden" />
            )} */}

            {session?.status === 'authenticated' && user?.isAdmin && (
              <Button title={'المستخدمين'} style={' '} path="/users" />
            )}
          </div>
          {/* {userRecipeCount > 0 && (
            <div className="p-4 rounded-r-lg bg-four overflow-hidden my-4">
              <TheGarden />
            </div>
          )} */}

          <div className="px-2 rounded-r-lg bg-four overflow-hidden my-4">
            <Categories />
          </div>
        </div>
      )}
    </div>
  );
}
