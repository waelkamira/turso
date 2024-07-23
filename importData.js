const fs = require('fs');
const csv = require('csv-parser');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const results = [];

  // Read CSV file and parse data
  fs.createReadStream('meals.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      // Insert data into the database
      for (const item of results) {
        try {
          await prisma.meal.create({
            data: {
              userName: item.userName,
              createdBy: item.createdBy,
              userImage: item.userImage || null,
              mealName: item.mealName,
              selectedValue: item.selectedValue || null,
              image: item.image || null,
              ingredients: item.ingredients,
              theWay: item.theWay,
              advise: item.advise || null,
              link: item.link || null,
              favorite: item.favorite === '1', // Convert '1' or '0' to boolean
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            },
          });
          console.log(`Inserted meal: ${item.mealName}`);
        } catch (error) {
          console.error(`Error inserting meal: ${item.mealName}`, error);
        }
      }

      console.log('All data has been inserted');
      await prisma.$disconnect();
    });
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
