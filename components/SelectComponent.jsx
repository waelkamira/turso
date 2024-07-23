'use client';
import React, { useContext, useEffect, useState } from 'react';
import Select from 'react-select';
import { inputsContext } from './Context.jsx';
export default function SelectComponent() {
  const { dispatch } = useContext(inputsContext);
  const [selectedValue, setSelectedValue] = useState('');
  const options = [
    { value: 'وجبة رئيسية', label: 'وجبة رئيسية' },
    { value: 'معجنات', label: 'معجنات' },
    { value: 'شوربات', label: 'شوربات' },
    { value: 'سلطات', label: 'سلطات' },
    { value: 'عصائر و مشروبات', label: 'عصائر و مشروبات' },
    { value: 'مقبلات', label: 'مقبلات' },
    { value: 'حلويات', label: 'حلويات' },
  ];

  useEffect(() => {
    //مختلفة لسرعة البحث والتصنيف models قمت بعمل جمل شرطية بغرض تصنيف الوجبات في
    if (selectedValue?.value === 'شوربات') {
      dispatch({
        type: 'SELECTED_VALUE',
        payload: { selectedValue: selectedValue, modelName: 'createSoup' },
      });
    } else if (selectedValue?.value === 'معجنات') {
      dispatch({
        type: 'SELECTED_VALUE',
        payload: { selectedValue: selectedValue, modelName: 'createPastries' },
      });
    } else if (selectedValue?.value === 'وجبة رئيسية') {
      dispatch({
        type: 'SELECTED_VALUE',
        payload: { selectedValue: selectedValue, modelName: 'createMainMeal' },
      });
    } else if (selectedValue?.value === 'سلطات') {
      dispatch({
        type: 'SELECTED_VALUE',
        payload: { selectedValue: selectedValue, modelName: 'createSalads' },
      });
    } else if (selectedValue?.value === 'عصائر و مشروبات') {
      dispatch({
        type: 'SELECTED_VALUE',
        payload: { selectedValue: selectedValue, modelName: 'createJuice' },
      });
    } else if (selectedValue?.value === 'مقبلات') {
      dispatch({
        type: 'SELECTED_VALUE',
        payload: {
          selectedValue: selectedValue,
          modelName: 'createAppetizers',
        },
      });
    } else if (selectedValue?.value === 'حلويات') {
      dispatch({
        type: 'SELECTED_VALUE',
        payload: { selectedValue: selectedValue, modelName: 'createDessert' },
      });
    }
  }, [selectedValue]);

  function customTheme(theme) {
    return {
      ...theme,
      borderRadius: 8,
      colors: {
        ...theme.colors,
        primary: '#EC1E21',
        primary25: '#FBCCCC',
      },
    };
  }
  // selectedValue لتحديث قيمة ال setSelectedValue مجرد بارامتر يمثل القيمة المختارة من قبل المستخدم نقوم بتمريره ل e
  // function handleChange(e) {
  //   setSelectedValue(e);
  //   dispatch({ type: 'selectedValue', payload: selectedValue });
  // }

  return (
    <Select
      defaultValue={selectedValue}
      onChange={setSelectedValue}
      placeholder="وجبة رئيسية"
      isClearable
      isSearchable
      options={options}
      theme={customTheme}
      className="w-full text-xl text-start placeholder:text-sm placeholder:sm:text-lg"
    >
      Select
    </Select>
  );
}
