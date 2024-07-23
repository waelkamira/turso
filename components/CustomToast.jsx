'use client';
import Image from 'next/image';
import React from 'react';
export default function CustomToast({
  t,
  message,
  emoji,
  greenEmoji,
  redEmoji,
}) {
  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white text-four shadow-lg rounded-lg pointer-events-auto flex-2 items-center justify-center p-4 mx-2 border`}
    >
      <div className="flex justify-between items-center my-1">
        <div className="flex-1 w-full">
          <div className="flex justify-center items-center gap-2">
            <div className="relative w-14 h-14 flex-shrink-0 pt-0.5 rounded-full ">
              <Image
                className="h-10 w-10 rounded-full"
                src="https://res.cloudinary.com/dh2xlutfu/image/upload/v1718716951/cooking/bahiga_cmzcf4.png"
                alt="photo"
                fill
              />
            </div>
            <div className="ml-3 flex-1">
              <h1 className="text-sm">بهيجة اشرق لبن</h1>
            </div>
          </div>
        </div>
      </div>
      {/* <hr className="w-full h-[1px] bg-four rounded-full border-hidden select-none my-1" /> */}

      <div>
        <div>
          <h1 className="sm:mt-4 text-[12px] sm:text-sm s:text-nowrap text-center  ">
            <span className="text-green-400 text-xl font-bold">
              {greenEmoji}
            </span>
            <span className="text-one text-xl mx-1 font-bold">{redEmoji}</span>

            {message}
            <span className="text-green-400 text-xl mx-1 font-bold">
              {emoji}
            </span>
          </h1>
        </div>
      </div>
    </div>
  );
}
