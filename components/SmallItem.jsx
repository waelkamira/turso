'use client';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Loading from './Loading';
import CustomToast from './CustomToast';
import { formatDistanceToNow } from 'date-fns/formatDistanceToNow';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { IoMdClose } from 'react-icons/io';
import { FaHeart } from 'react-icons/fa';
import { SlLike } from 'react-icons/sl';
import { inputsContext } from '../components/Context';
import LoadingPhoto from './LoadingPhoto';

export default function SmallItem({ recipe, index, show = true, id = false }) {
  const [currentUser, setCurrentUser] = useState('');
  const [favorites, setFavorites] = useState();
  const [numberOfLikes, setNumberOfLikes] = useState(recipe?.likes);
  const [numberOfEmojis, setNumberOfEmojis] = useState(recipe?.emojis);
  const [numberOfHearts, setNumberOfHearts] = useState(recipe?.hearts);

  const [like, setLike] = useState(false);
  const [heart, setHeart] = useState(false);
  const [emoji, setEmoji] = useState(false);

  const { dispatch, action } = useContext(inputsContext);
  const session = useSession();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('CurrentUser');
      if (userData !== 'undefined') {
        const user = JSON.parse(userData);
        setCurrentUser(user);
      }
    }
    fetchFavoritePosts();
    // setActions();
  }, []);

  // function setActions() {
  //   const isLiked = recipe?.likes?.filter(
  //     (item) => item === session?.data?.user?.email
  //   );
  //   if (isLiked?.length > 0) {
  //     setLike(true);
  //   }
  //   const isEmoji = recipe?.emojis?.filter(
  //     (item) => item === session?.data?.user?.email
  //   );
  //   if (isEmoji?.length > 0) {
  //     setEmoji(true);
  //   }
  //   const isHeart = recipe?.hearts?.filter(
  //     (item) => item === session?.data?.user?.email
  //   );
  //   if (isHeart?.length > 0) {
  //     setHeart(true);
  //   }
  // }
  //? يتم تفعيل هذه الدالة عند الضغط على زر حفظ ليتم حفظ البوست الذي تم الضغط عليه من قبل المستخدم في قائمة مفضلاته
  //? أو سوف يتم حذف هذا البوست من قائمة مفضلة المستخدم إذا كان موجودا أي أن المستخدم لم يعد يريده في قائمته

  async function handleInteraction(mealId, action) {
    const response = await fetch(`/api/actions/${action}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mealId }),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);

      if (action === 'likes') {
        setLike(!like);
        setNumberOfLikes((prev) => (like ? prev - 1 : prev + 1));
      } else if (action === 'favorites') {
        setHeart(!heart);
        setNumberOfHearts((prev) => (heart ? prev - 1 : prev + 1));
      } else if (action === 'hearts') {
        setEmoji(emoji);
        setNumberOfEmojis((prev) => (emoji ? prev - 1 : prev + 1));
      }

      toast.custom((t) => (
        <CustomToast
          t={t}
          message={result.message}
          greenEmoji={'✔'}
          emoji={'😋'}
        />
      ));
    } else {
      console.error(`Failed to toggle ${action}`);
      toast.custom((t) => (
        <CustomToast t={t} message={'حدث خطأ ما'} emoji={'😐'} />
      ));
    }
  }

  //? للبحث عن هذا البوست في قائمة المفضلة اذا موجود يتم تفعيل اللون الاحمر بأن المستخدم بالفعل أعجب بهذا البوست من قبل
  async function fetchFavoritePosts(id) {
    const response = await fetch(`/api/hearts&id=${id}`);
    const json = await response?.json();

    if (response.ok) {
      setFavorites(json);
      const findPost = json.filter((post) => post?.postId === recipe?.id);
      if (findPost[0]) {
        setHeart(true);
      } else {
        setHeart(false);
      }
    }
  }

  //? لحذف أي بوست من أي مستخدم هذه الدالة خاصة بالأدمن فقط
  async function handleDeletePost(recipe) {
    const response = await fetch('/api/allCookingRecipes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(recipe),
    });

    if (response.ok) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          message={'تم حذف هذا البوست بنجاح'}
          greenEmoji={'✔'}
        />
      ));
      dispatch({ type: 'DELETE_RECIPE', payload: recipe });
    } else {
      toast.custom((t) => (
        <CustomToast t={t} message={'😐 حدث خطأ ما'} redEmoji={'✖'} />
      ));
    }
  }
  //? هذه الدالة للتأكد إذا كان التاريخ المدخل صحيحا أو لا
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date)
      ? 'Invalid date'
      : formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <>
      {!recipe && <Loading />}
      <div
        key={index}
        id="post1"
        className="flex flex-col justify-center items-center shadow-md w-full p-4 rounded-lg mb-4 bg-white border-t-[20px] border-green-500 transition-all duration-300"
      >
        <div className="flex items-center justify-center w-full p-2">
          <Link
            href={'/profile'}
            className="cursor-pointer flex justify-start items-center gap-2 w-full h-fit "
          >
            <div className="overflow-hidden rounded-full">
              <div className="relative size-12 rounded-full overflow-hidden">
                {!recipe?.userImage && <LoadingPhoto />}
                {recipe?.userImage && (
                  <Image
                    src={recipe?.userImage}
                    layout="fill"
                    objectFit="cover"
                    alt={recipe?.mealName}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-col justify-center items-start">
              <h6 className="text-[14px] text-eight select-none">
                {recipe?.userName}{' '}
              </h6>
              <h1 className="text-[10px] text-gray-400 select-none" dir="ltr">
                {formatDate(recipe?.createdAt)}
              </h1>
            </div>
          </Link>

          {currentUser?.isAdmin === true && path === '/' && (
            <div
              className="flex flex-col items-center justify-center cursor-pointer bg-four rounded-lg p-2 md:text-2xl text-white hover:bg-one"
              onClick={() => handleDeletePost(recipe)}
            >
              <IoMdClose className="" />
              <h6 className="text-sm select-none">حذف</h6>
            </div>
          )}
        </div>
        <h1 className="text-one my-2 sm:my-4 text-xl sm:text-3xl font-medium bg-white select-none line-clamp-1">
          {recipe?.mealName}
        </h1>
        <div
          className={`relative w-full h-52 sm:h-72 lg:h-96 overflow-hidden rounded-lg bg-gray-100`}
        >
          {!recipe?.image && <LoadingPhoto />}

          {recipe?.image && (
            <Image
              src={recipe?.image}
              layout="fill"
              objectFit="cover"
              alt={recipe?.mealName}
            />
          )}
        </div>
        {show && (
          <>
            <div className="flex justify-between items-center gap-2 w-full text-gray-400 my-2">
              <div
                className="flex justify-center items-center gap-2 cursor-pointer hover:bg-seven p-1 lg:p-2 rounded-lg select-none"
                onClick={() => {
                  handleInteraction(recipe?.id, 'hearts'); // For hearts

                  if (session?.status === 'authenticated') {
                    if (!heart) {
                      setNumberOfHearts(numberOfHearts + 1);
                    } else {
                      setNumberOfHearts(numberOfHearts - 1);
                    }
                  } else {
                    toast.custom((t) => (
                      <CustomToast
                        t={t}
                        message={
                          'يجب عليك تسجيل الدخول أولا لحفظ هذه الوصفة 😉'
                        }
                      />
                    ));
                  }
                }}
              >
                <div className="hover:scale-105">
                  <FaHeart
                    className={
                      (heart ? 'text-one' : 'text-gray-400') +
                      ' text-[10px] md:text-[13px] lg:text-[15px] select-none'
                    }
                  />
                </div>

                <h1
                  className={
                    (heart ? 'text-one' : 'text-gray-400') +
                    '  text-[10px] md:text-[13px] lg:text-[15px] select-none'
                  }
                >
                  حفظ
                </h1>
                <h6 className="text-[10px] md:text-[13px] lg:text-[15px] select-none">
                  {numberOfHearts}
                </h6>
              </div>
              <div
                className="flex justify-center items-center gap-2 cursor-pointer hover:bg-seven p-1 lg:p-2 rounded-lg select-none"
                onClick={() => {
                  handleInteraction(recipe?.id, 'likes');
                  if (session?.status === 'authenticated') {
                    setLike(!like);
                    if (!like) {
                      setNumberOfLikes(+numberOfLikes + 1);
                    } else {
                      setNumberOfLikes(+numberOfLikes - 1);
                    }
                    // For likes
                  } else {
                    toast.custom((t) => (
                      <CustomToast
                        t={t}
                        message={'يجب عليك تسجيل الدخول أولا 😉'}
                      />
                    ));
                  }
                }}
              >
                <SlLike
                  className={
                    (like ? 'text-blue-400' : 'text-gray-400') +
                    '  text-[10px] md:text-[13px] lg:text-[15px] select-none'
                  }
                />
                <h1
                  className={
                    (like ? 'text-blue-400' : 'text-gray-400') +
                    ' text-[10px] md:text-[13px] lg:text-[15px] select-none'
                  }
                >
                  أعجبني
                </h1>

                <h6 className="text-[10px] md:text-[13px] lg:text-[15px] select-none">
                  {numberOfLikes}
                </h6>
              </div>
              <div
                className="flex justify-center items-center gap-2 cursor-pointer hover:bg-seven py-1 px-2 rounded-lg select-none"
                onClick={() => {
                  handleInteraction(recipe?.id, 'emojis'); // For emojis

                  if (session?.status === 'authenticated') {
                    setEmoji(!emoji);
                    if (!emoji) {
                      setNumberOfEmojis(numberOfEmojis + 1);
                    } else {
                      setNumberOfEmojis(numberOfEmojis - 1);
                    }
                  } else {
                    toast.custom((t) => (
                      <CustomToast
                        t={t}
                        message={'يجب عليك تسجيل الدخول أولا 😉'}
                      />
                    ));
                  }
                }}
              >
                <h1
                  className={
                    (emoji ? 'text-green-400' : 'grayscale') +
                    ' text-[16px] select-none'
                  }
                >
                  🥝
                </h1>
                <h1
                  className={
                    (emoji ? 'text-green-400' : 'text-gray-400') +
                    '  text-[10px] md:text-[13px] lg:text-[15px] select-none'
                  }
                >
                  لذيذ
                </h1>

                <h6 className="text-[10px] md:text-[13px] lg:text-[15px] select-none">
                  {numberOfEmojis}
                </h6>
              </div>
            </div>
            <hr className="w-full h-[1.5px] bg-gray-400 rounded-full border-hidden select-none" />
          </>
        )}
        <div className="bg-white rounded-lg p-4 w-full">
          <h1 className="text-one sm:font-bold text-xl text-start w-full my-2 select-none">
            المقادير:
          </h1>
          <pre className="text-sm sm:text-lg text-start w-full line-clamp-5 select-none">
            {recipe?.ingredients}
          </pre>
        </div>
        <button
          onClick={() => {
            if (session?.status === 'authenticated') {
              router.push(`/recipes/${id ? recipe?.postId : recipe?.id}`);
            } else {
              toast.custom((t) => (
                <CustomToast
                  t={t}
                  message={'يجب عليك تسجيل الدخول أولا لرؤية هذه الوصفة 😉'}
                />
              ));
            }
          }}
          className="sm:text-2xl p-2 bg-green-500 text-white hover:scale-[102%] hover:text-white font-medium text-center select-none w-full rounded-full shadow-lg transition-all duration-300 "
        >
          عرض الوصفة
        </button>
      </div>
    </>
  );
}
