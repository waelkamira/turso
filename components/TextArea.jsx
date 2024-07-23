import React from 'react';

export default function TextArea({ errors, title }) {
  return (
    <div className="w-full my-4">
      {errors.ingredients && (
        <h1 className="text-one text-2xl text-end my-2 w-full animate-bounce font-bold">
          حقل المقادير مطلوب
        </h1>
      )}
      <div className="flex items-center gap-2 w-full justify-end">
        {' '}
        <h1 className="text-right text-xl text-white font-bold my-2">
          {title}{' '}
        </h1>
        <h1 className="text-one font-bold text-2xl">#</h1>
      </div>

      <textarea
        value={inputs.ingredients}
        onChange={(e) => setInputs({ ...inputs, ingredients: e.target.value })}
        dir="rtl"
        rows={'6'}
        name="المقادير"
        id="المقادير"
        className="scrollBar text-right w-full p-2 rounded-lg text-xl h-36 outline-2 focus:outline-one"
        placeholder={`١- خبز توست حسب الرغبة
٢- جبن شرائح
٣- ٥ بيضات مخفوقة
٤- ملح وفلفل
٥- بقدونس مفروم ناعماً للتزيين
                `}
      ></textarea>
    </div>
  );
}
