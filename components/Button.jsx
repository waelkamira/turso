import Link from 'next/link';
import React from 'react';

export default function Button({ style, title, onClick, path = '' }) {
  return (
    <Link href={path} className="w-full">
      <button
        type="submit"
        onClick={onClick}
        className={
          (style ? 'text-lg p-2 ' + style : 'text-sm p-0.5') +
          ' btn my-2 text-white text-nowrap bg-five select-none rounded-full w-full max-h-12 hover:text-white   border hover:border-[#596067]'
        }
      >
        {title}
      </button>
    </Link>
  );
}
