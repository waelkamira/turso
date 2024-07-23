'use client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import CurrentUser from '../components/CurrentUser';
import Image from 'next/image';
import Link from 'next/link';
import Button from './Button';
import LoadingPhoto from './LoadingPhoto';

export default function SideBarMenu({ setIsOpen }) {
  const session = useSession();
  const user = CurrentUser();

  return (
    <div className="p-4 w-52 h-fit border-[5px] border-one bg-four rounded-lg z-50">
      {session?.status === 'authenticated' && (
        <Link href={'/profile?username'}>
          <div className="flex flex-col justify-between items-center rounded-lg w-full">
            <div className="flex justify-start items-center w-full cursor-pointer line-clamp-1 mb-2">
              <div className="relative size-10 overflow-hidden rounded-full">
                {!user?.image && <LoadingPhoto />}
                {user?.image && (
                  <Image
                    src={user?.image}
                    fill
                    alt={session?.data?.user?.name}
                  />
                )}
              </div>
              <h1 className=" text-white text-nowrap text-start mx-3 text-sm line-clamp-1 select-none">
                {session?.data?.user?.name}
              </h1>
            </div>
          </div>
        </Link>
      )}
      {session?.status === 'unauthenticated' && (
        <Button title={'تسجيل الدخول'} path={'/login'} />
      )}

      {session?.status === 'authenticated' && user?.isAdmin && (
        <Button path={'/users'} title={'المستخدمين'} />
      )}
      {session?.status === 'authenticated' && (
        <div>
          <Button title={'إنشاء وصفة'} path="/newRecipe" />
          <Button title={'شو أطبخ اليوم؟'} path={'/whatToCookToday'} />
          <Button title={'طبخاتي'} path="/myRecipes" />
          <Button title={'وصفات أعجبتني'} path={'/favoritePosts'} />
          <Button title={'الجوائز'} path="/myGarden" />
          <Button title={'تسجيل الخروج'} path={'/'} onClick={() => signOut()} />
        </div>
      )}
      <Button title={'إغلاق'} onClick={() => setIsOpen(false)} />
    </div>
  );
}
