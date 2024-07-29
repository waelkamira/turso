'use client';
import React, { createContext, useReducer } from 'react';

function inputsReducer(currentState, action) {
  switch (action.type) {
    case 'SET_RECIPES':
      return {
        allCookingRecipes: action?.payload,
      };
    case 'New_RECIPE':
      // console.log('New_RECIPE', action?.payload);
      return {
        newRecipe: action?.payload,
      };
    case 'SELECTED_VALUE':
      // console.log('from Context', action?.payload);
      return {
        data: {
          ...currentState?.data,
          selectedValue: action.payload.selectedValue,
          modelName: action.payload.modelName,
        },
      };
    case 'DELETE_RECIPE':
      // console.log('from Context', action?.payload);
      return {
        deletedRecipe: {
          ...currentState?.data,
          selectedValue: action.payload.selectedValue,
          modelName: action.payload.modelName,
        },
      };
    case 'IMAGE':
      // console.log('image', action.payload);
      return {
        data: { ...currentState?.data, image: action.payload },
      };
    case 'PROFILE_IMAGE':
      return {
        profile_image: { image: action.payload },
      };

    case 'IMAGE_ERROR':
      return {
        imageError: action?.payload,
      };
    case 'ACTION':
      return {
        action: action?.payload,
      };
    case 'MY_RECIPES':
      return {
        myRecipes: action?.payload,
      };

    default:
      return currentState;
  }
}

export const inputsContext = createContext('');
export function InputsContextProvider({ children }) {
  const [state, dispatch] = useReducer(inputsReducer, {
    data: {},
    imageError: {},
    profile_image: {},
    allCookingRecipes: [],
    newRecipe: {},
    deletedRecipe: {},
    deleteFavoritePost: {},
    action: {},
    myRecipes: [],
  });
  // console.log('from Context', state);

  return (
    <inputsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </inputsContext.Provider>
  );
}
