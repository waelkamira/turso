'use client';
import CurrentUser from '../../components/CurrentUser';
import ImageUpload from '../../components/ImageUpload';
import Button from '../../components/Button';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import { MdOutlineAddPhotoAlternate } from 'react-icons/md';
import { inputsContext } from '../../components/Context';
import toast from 'react-hot-toast';
import Link from 'next/link';
import CustomToast from '../../components/CustomToast';
import BackButton from '../../components/BackButton';
import SideBarMenu from '../../components/SideBarMenu';
import { TfiMenuAlt } from 'react-icons/tfi';
import { MdEdit } from 'react-icons/md';

export default function Profile() {
  const session = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const user = CurrentUser();
  const { profile_image, dispatch } = useContext(inputsContext);
  const [newUserName, setNewUserName] = useState('');
  const [newImage, setNewImage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const newName = JSON.parse(localStorage.getItem('CurrentUser'));
      setNewUserName(newName?.name);
    }
    setNewImage(profile_image?.image);
    editProfileImageAndUserName();
  }, [profile_image?.image]);

  async function editProfileImageAndUserName() {
    if (profile_image?.image || newUserName) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('image', JSON.stringify(profile_image?.image));
      }
      console.log('newUserName', newUserName);
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: session?.data?.user?.email,
          image: profile_image?.image,
          name: newUserName,
        }),
      });
      if (response.ok) {
        toast.custom((t) => (
          <CustomToast t={t} message={'تم التعديل بنجاح '} greenEmoji={'✔'} />
        ));
        dispatch({ type: 'PROFILE_IMAGE', payload: profile_image?.image });
        if (typeof window !== 'undefined') {
          const newName = JSON.parse(localStorage.getItem('CurrentUser'));
          setNewUserName(newName?.name);
        }
      } else {
        toast.custom((t) => (
          <CustomToast t={t} message={'حدث حطأ ما حاول مرة أخرى 😐'} />
        ));
      }
    }
  }
  return (
    <>
      {session?.status === 'unauthenticated' && (
        <div className="p-4 bg-four rounded-lg m-2 md:m-8 border border-one text-center h-screen">
          <h1 className="text-lg md:text-2xl p-2 my-8 text-white">
            يجب عليك تسجيل الدخول أولا لرؤية هذا البروفايل
          </h1>
          <div className="flex flex-col justify-between items-center gap-4 w-full">
            <Button title={'تسجيل الدخول'} style={' '} path="/login" />

            <BackButton />
          </div>
        </div>
      )}
      {session?.status === 'authenticated' && (
        <div className="relative flex justify-center items-center w-full h-full bg-four  xl:p-8 rounded-lg text-md sm:text-lg lg:text-xl">
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
          <div className="flex flex-col items-center gap-4  justify-center w-full 2xl:w-2/3 h-full rounded-lg overflow-hidden">
            <div className="relative w-full ">
              <div className="relative h-96 w-full  rounded-lg">
                <Image
                  src={
                    'https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716961/cooking/profile_background_ifl7zl.png'
                  }
                  layout="fill"
                  objectFit="cover"
                  alt={user?.name}
                />
              </div>
              <div className="relative">
                {/* <div className="absolute right-1 -bottom-6 h-20 w-20 bg-four border-2 border-one rounded-full cursor-pointer overflow-hidden z-40">
                  <Image
                    src={user?.image}
                    layout="fill"
                    objectFit="cover"
                    alt={user?.name}
                  />
                </div> */}
              </div>
              <div className="relative">
                <div className="absolute right-1 -bottom-6 h-20 w-20 bg-four rounded-full cursor-pointer overflow-hidden z-40">
                  <ImageUpload
                    image={user?.image}
                    style={
                      'peer/image rounded-lg w-20 h-20 cursor-pointer overflow-hidden'
                    }
                  />
                </div>
                <MdOutlineAddPhotoAlternate className="absolute text-one text-xl -top-12 right-1 z-50" />
              </div>
            </div>

            <div className="flex flex-col justify-center items-center w-full text-start text-white">
              <div className="flex flex-col items-start gap-2 justify-between rounded-lg px-8 py-2 w-full my-2">
                <div className="flex justify-between items-center">
                  {/* <h5 className="text-sm">تغيير الإسم: </h5> */}
                  <h1 className="text-nowrap text-start w-full select-none">
                    <span className="text-one font-bold text-xl ml-2">
                      {' '}
                      <MdEdit />
                    </span>
                    <span
                      contentEditable="true"
                      onInput={(e) =>
                        setNewUserName(e.currentTarget.textContent)
                      }
                    >
                      {user?.name}
                    </span>
                  </h1>
                </div>
                <div className="w-44 ">
                  <Button
                    title={'حفظ الإسم'}
                    onClick={() => editProfileImageAndUserName()}
                  />
                </div>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400 rounded-lg border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between rounded-lg px-8 py-2 w-full my-2">
                <h1 className="text-nowrap text-start w-full select-none">
                  <span className="text-one font-bold text-2xl ml-2">#</span>
                  {session?.data?.user?.email}
                </h1>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400 rounded-lg border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between rounded-lg px-8 py-2 w-full my-2">
                <Link href={'/myRecipes'} className="w-full">
                  <h1 className="text-nowrap text-start w-full select-none cursor-pointer ">
                    <span className="text-one font-bold text-2xl ml-2 ">#</span>
                    وصفاتي{' '}
                  </h1>
                </Link>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400 rounded-lg border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between rounded-lg px-8 py-2 w-full my-2">
                <Link href={'/favoritePosts'} className="w-full">
                  <h1 className="text-nowrap text-start w-full select-none cursor-pointer ">
                    <span className="text-one font-bold text-2xl ml-2 ">#</span>
                    وصفات أعجبتني{' '}
                  </h1>
                </Link>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400 rounded-lg border-hidden" />
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 justify-between rounded-lg px-8 py-2 w-full my-2">
                <Link href={'/newRecipe'} className="w-full">
                  <h1 className="text-nowrap text-start w-full select-none cursor-pointer ">
                    <span className="text-one font-bold text-2xl ml-2 ">#</span>
                    إنشاء وصفة جديدة
                  </h1>
                </Link>
                <div className="flex items-center w-full">
                  <hr className="w-full h-0.5 bg-gray-400 rounded-lg border-hidden" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
