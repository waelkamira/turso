'use client';
import { useContext, useEffect, useState } from 'react';
import { inputsContext } from './Context';
import { useSession } from 'next-auth/react';

export default function CurrentUser() {
  const { profile_image } = useContext(inputsContext);
  const [user, setUser] = useState();
  // const session = useSession();
  // console.log('user', user);
  useEffect(() => {
    getUserData();
  }, [profile_image?.image]);

  async function getUserData() {
    const response = await fetch('/api/user');
    const json = await response?.json();

    if (response.ok) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('CurrentUser', JSON.stringify(json[0]));
      }

      setUser(json[0]);
    }
  }
  return { ...user };
}
