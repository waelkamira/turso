// //!  csv  الى  json لتحويل ال
// const fs = require('fs');
// const { parse } = require('json2csv');

// // دالة لتحويل محتوى ملف JSON إلى الشكل الجديد
// function transformJsonData(filePath) {
//   const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

//   const transformedData = data.map((item) => ({
//     id: item._id.$oid, // تحويل الـ id إلى نفس قيمته في ملف JSON
//     userName: item.userName || '',
//     createdBy: item.createdBy || '',
//     userImage: item.userImage || '',
//     mealName: item.mealName || '',
//     selectedValue: item.selectedValue || '',
//     image: item.image || '',
//     ingredients: item.ingredients || '',
//     theWay: item.theWay || '',
//     advise: item.advise || '',
//     link: item.link || '',
//     createdAt: new Date(item.createdAt.$date).toISOString(),
//     updatedAt: new Date(item.updatedAt.$date).toISOString(),
//     hearts: item.usersWhoPutHeartOnThisRecipe
//       ? item.usersWhoPutHeartOnThisRecipe.length
//       : 5, // حساب عدد القلوب
//     likes: item.usersWhoLikesThisRecipe
//       ? item.usersWhoLikesThisRecipe.length
//       : 5, // حساب عدد الإعجابات
//     emojis: item.usersWhoPutEmojiOnThisRecipe
//       ? item.usersWhoPutEmojiOnThisRecipe.length
//       : 5, // حساب عدد الرموز التعبيرية
//     __drizzlerowid__: item.__drizzlerowid__ || 5, // هذا يمكن تجاهله إذا لم يكن موجودًا في النموذج
//   }));

//   return transformedData;
// }

// // دالة لحفظ البيانات المحولة إلى ملف CSV جديد
// function saveTransformedDataAsCSV(inputFilePath, outputFilePath) {
//   const transformedData = transformJsonData(inputFilePath);

//   // تحويل البيانات إلى CSV
//   const csv = parse(transformedData);

//   // حفظ البيانات في ملف CSV
//   fs.writeFileSync(outputFilePath, csv, 'utf8');
//   console.log(
//     `Data has been successfully transformed to CSV and saved to ${outputFilePath}`
//   );
// }

// // استخدام الدالة لحفظ البيانات المحولة
// const inputFilePath = 'meals.json';
// const outputFilePath = 'C:\\Users\\ramon\\Desktop\\transformed_file.csv';

// saveTransformedDataAsCSV(inputFilePath, outputFilePath);

const fs = require('fs');
const csv = require('csv-parser');
const { createObjectCsvWriter } = require('csv-writer');

const inputFilePath = '/meals.csv';
const outputFilePath = 'C:\\Users\\ramon\\Desktop\\transformed_file.csv';

const rows = [];

fs.createReadStream(inputFilePath)
  .pipe(csv())
  .on('data', (row) => {
    // تحويل القيم النصية إلى أرقام
    row.id = String(row.id); // تأكد من أن id هو نص
    row.hearts = Number(row.hearts);
    row.likes = Number(row.likes);
    row.emojis = Number(row.emojis);
    rows.push(row);
  })
  .on('end', () => {
    const csvWriter = createObjectCsvWriter({
      path: outputFilePath,
      header: [
        { id: 'id', title: 'id' },
        { id: 'userName', title: 'userName' },
        { id: 'createdBy', title: 'createdBy' },
        { id: 'userImage', title: 'userImage' },
        { id: 'mealName', title: 'mealName' },
        { id: 'selectedValue', title: 'selectedValue' },
        { id: 'image', title: 'image' },
        { id: 'ingredients', title: 'ingredients' },
        { id: 'theWay', title: 'theWay' },
        { id: 'advise', title: 'advise' },
        { id: 'link', title: 'link' },
        { id: 'createdAt', title: 'createdAt' },
        { id: 'updatedAt', title: 'updatedAt' },
        { id: 'hearts', title: 'hearts' },
        { id: 'likes', title: 'likes' },
        { id: 'emojis', title: 'emojis' },
        { id: '__drizzlerowid__', title: '__drizzlerowid__' },
      ],
    });

    csvWriter.writeRecords(rows).then(() => {
      console.log('تم تحويل الملف وكتابته بنجاح.');
    });
  });
