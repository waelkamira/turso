const fs = require('fs');
const { parse } = require('json2csv');

const data = require('./meals.json'); // Replace with the path to your JSON file

const fields = [
  'userName',
  'createdBy',
  'userImage',
  'mealName',
  'selectedValue',
  'image',
  'ingredients',
  'theWay',
  'advise',
  'link',
  'favorite',
  'createdAt',
  'updatedAt',
  'usersWhoPutEmojiOnThisRecipe', // This field may need to be handled as an array
];

const opts = { fields };

try {
  const csv = parse(data, opts);
  fs.writeFileSync('output.csv', csv);
  console.log('CSV file successfully created');
} catch (err) {
  console.error(err);
}
