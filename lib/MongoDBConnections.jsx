const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');

// Connection options
const connectionOptions = {
  // useUnifiedTopology: true,
  // useNewUrlParser: true,
  maxPoolSize: 100, // Set pool size to ensure you do not exceed 500 connections in total
};

// Maintain a connection pool
let connections = {};

async function makeNewConnection(uri) {
  if (connections[uri]) {
    console.log(`MongoDB :: Reusing connection for ${uri}`);
    return connections[uri];
  }

  const client = new MongoClient(uri, connectionOptions);

  client.on('error', (error) => {
    console.error('MongoDB :: Connection error:', error);
  });

  client.on('open', () => console.log('MongoDB :: Connected to database'));

  const connection = await mongoose
    .createConnection(uri, connectionOptions)
    .asPromise();
  connections[uri] = connection;

  return connection;
}

async function initializeConnections() {
  const usersConnection = await makeNewConnection(
    process.env.NEXT_PUBLIC_MONGODB
  );
  const favoritesConnection = await makeNewConnection(
    process.env.NEXT_PUBLIC_MONGODB_FAVORITES
  );
  const mealsConnection = await makeNewConnection(
    process.env.NEXT_PUBLIC_MONGODB_MEALS
  );

  // Handle application termination to gracefully close connections
  process.on('SIGINT', async () => {
    for (const uri in connections) {
      if (connections.hasOwnProperty(uri)) {
        await connections[uri].close();
        console.log(`MongoDB :: Connection closed for ${uri}`);
      }
    }
    process.exit(0);
  });

  // Optional: Utilize Mongoose connection events for debugging
  mongoose.connection.on('error', (error) =>
    console.error('MongoDB :: Mongoose connection error:', error)
  );
  mongoose.connection.on('open', () =>
    console.log('MongoDB :: Mongoose connection opened')
  );

  return { usersConnection, favoritesConnection, mealsConnection };
}

module.exports = initializeConnections;

// // ! هذا الكود يعمل بشكل صحيح وهو معدل عن الذي تحته
// const mongoose = require('mongoose');
// const { MongoClient } = require('mongodb'); // For manual connection monitoring (optional)

// // Connection options (consider using these in your mongoose connection)
// const connectionOptions = {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
// };

// function makeNewConnection(uri) {
//   const client = new MongoClient(uri, connectionOptions);

//   // Optional: Manual connection monitoring using MongoClient events
//   client.on('error', (error) => {
//     console.error('MongoDB :: Connection error:', error);
//   });

//   client.on('open', () => console.log('MongoDB :: Connected to database'));

//   return mongoose.createConnection(uri, connectionOptions);
// }

// // Create connections using environment variables
// const usersConnection = makeNewConnection(process.env.NEXT_PUBLIC_MONGODB);
// const favoritesConnection = makeNewConnection(
//   process.env.NEXT_PUBLIC_MONGODB_FAVORITES
// );
// const mealsConnection = makeNewConnection(
//   process.env.NEXT_PUBLIC_MONGODB_MEALS
// );

// // Handle application termination to gracefully close connections
// process.on('SIGINT', async () => {
//   await usersConnection.close();
//   await favoritesConnection.close();
//   await mealsConnection.close();
//   console.log('MongoDB :: Connections closed due to application termination');
//   process.exit(0);
// });

// // Optional: Utilize Mongoose connection events for debugging
// mongoose.connection.on('error', (error) =>
//   console.error('MongoDB :: Mongoose connection error:', error)
// );
// mongoose.connection.on('open', () =>
//   console.log('MongoDB :: Mongoose connection opened')
// );

// module.exports = {
//   usersConnection,
//   favoritesConnection,
//   mealsConnection,
// };

// //! في حال الحاجة لقواعد بيانات أكثر يوجد كود في الاسفل

// const mongoose = require('mongoose');

// function makeNewConnection(uri) {
//   const db = mongoose.createConnection(uri);

//   db.on('error', function (error) {
//     console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
//     db.close().catch(() =>
//       console.log(`MongoDB :: failed to close connection ${this.name}`)
//     );
//   });

//   db.on('connected', function () {
//     mongoose.set('debug', function (col, method, query, doc) {
//       console.log(
//         `MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(
//           query
//         )},${JSON.stringify(doc)})`
//       );
//     });
//     console.log(`MongoDB :: connected ${this.name}`);
//   });

//   db.on('disconnected', function () {
//     console.log(`MongoDB :: disconnected ${this.name}`);
//   });

//   return db;
// }

// // Create connections using environment variables
// const usersConnection = makeNewConnection(process.env.NEXT_PUBLIC_MONGODB);
// const favoritesConnection = makeNewConnection(
//   process.env.NEXT_PUBLIC_MONGODB_FAVORITES
// );
// const mealsConnection = makeNewConnection(
//   process.env.NEXT_PUBLIC_MONGODB_MEALS
// );

// // Handle application termination to gracefully close connections
// process.on('SIGINT', async () => {
//   await usersConnection.close();
//   await favoritesConnection.close();
//   await mealsConnection.close();
//   console.log('MongoDB :: connections closed due to application termination');
//   process.exit(0);
// });

// module.exports = {
//   usersConnection,
//   favoritesConnection,
//   mealsConnection,
// };

//!  meals ل  connections  تم تعديله فقط للتعامل مع ستة  connections هذا الكود للتعامل مع مجموعة كبيرة من ال
//! أيضا favorites  و users يجب تعديله ليشمل ال

// const mongoose = require('mongoose');

// function makeNewConnection(uri) {
//   const db = mongoose.createConnection(uri);

//   db.on('error', function (error) {
//     console.log(`MongoDB :: connection ${this.name} ${JSON.stringify(error)}`);
//     db.close().catch(() =>
//       console.log(`MongoDB :: failed to close connection ${this.name}`)
//     );
//   });

//   db.on('connected', function () {
//     mongoose.set('debug', function (col, method, query, doc) {
//       console.log(
//         `MongoDB :: ${this.conn.name} ${col}.${method}(${JSON.stringify(
//           query
//         )},${JSON.stringify(doc)})`
//       );
//     });
//     console.log(`MongoDB :: connected ${this.name}`);
//   });

//   db.on('disconnected', function () {
//     console.log(`MongoDB :: disconnected ${this.name}`);
//   });

//   return db;
// }

// // Create connections using environment variables
// const usersConnection = makeNewConnection(process.env.NEXT_PUBLIC_MONGODB);
// const favoritesConnection = makeNewConnection(
//   process.env.NEXT_PUBLIC_MONGODB_FAVORITES
// );

// //! فيها connections لاحظ هنا قام بإنشاء مصفوفة و وضع ست
// const mealsConnections = [
//   makeNewConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS1),
//   makeNewConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS2),
//   makeNewConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS3),
//   makeNewConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS4),
//   makeNewConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS5),
//   makeNewConnection(process.env.NEXT_PUBLIC_MONGODB_MEALS6),
// ];

// // Handle application termination to gracefully close connections
// process.on('SIGINT', async () => {
//   await usersConnection.close();
//   await favoritesConnection.close();
//   for (const mealsConnection of mealsConnections) {
//     await mealsConnection.close();
//   }
//   console.log('MongoDB :: connections closed due to application termination');
//   process.exit(0);
// });

// module.exports = {
//   usersConnection,
//   favoritesConnection,
//   mealsConnections,
// };

//! meals ال  connections في حال التعامل مع مجموعة كبيرة من createMeal.js هذا الكود تعديل لكود

// import { mealsConnections } from '../../../lib/MongoDBConnections'; // Adjust the import path accordingly
// import { Meal } from '../models/CreateMealModel';

// export async function POST(req) {
//   const data = await req.json();
//   const mealIndex = data.index; // Assume data contains an index to determine which connection to use

//   // Ensure the mealsConnection is ready to be used
//   if (!mealsConnections[mealIndex].readyState) {
//     await mealsConnections[mealIndex].openUri(
//       process.env[`NEXT_PUBLIC_MONGODB_MEALS${mealIndex + 1}`]
//     );
//   }

//   // Using the existing connection to perform the operation
//   const MealModel = mealsConnections[mealIndex].model('Meal', Meal.schema);
//   const meal = await MealModel.create({ ...data });

//   return new Response(JSON.stringify(meal), { status: 201 });
// }
