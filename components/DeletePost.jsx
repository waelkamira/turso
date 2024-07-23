'use client';
import toast from 'react-hot-toast';
import { inputsContext } from './Context';
import { useContext } from 'react';
import CustomToast from './CustomToast';

export async function HandleDeletePost(recipe) {
  const { dispatch } = useContext(inputsContext);
  const response = await fetch('/api/allCookingRecipes', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recipe),
  });

  if (response.ok) {
    toast.custom((t) => (
      <CustomToast t={t} message={'تم حذف هذا البوست بنجاح'} greenEmoji={'✔'} />
    ));
    dispatch({ type: 'DELETE_RECIPE', payload: recipe });
  } else {
    toast.custom((t) => (
      <CustomToast t={t} message={'😐 حدث خطأ ما '} redEmoji={'✖'} />
    ));
  }
}
