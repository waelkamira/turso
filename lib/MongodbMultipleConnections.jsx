import { MongoClient } from 'mongodb-data-api';
import { Client } from 'mongodb-data-api';

const userApiKey = process.env.NEXT_PUBLIC_MONGODB_API_USERS;
const userBaseUrl =
  'https://data.mongodb-api.com/app/669a4c1e25646cf51ac3e406/endpoint/data/v1/action/';

const mealsApiKey = process.env.NEXT_PUBLIC_MONGODB_API_MEALS;
const mealsBaseUrl =
  'https://eu-central-1.aws.data.mongodb-api.com/app/data-wbnnweq/endpoint/data/v1';

const favoritesApiKey = process.env.FAVORITES_CLUSTER_API_KEY;
const favoritesBaseUrl =
  'https://data.mongodb-api.com/app/<favorites-cluster-app-id>/endpoint/data/v1/action/';

const databaseName = 'test';

// const favoritesClient = new Client(favoritesApiKey, favoritesBaseUrl);
// const userClient = new Client(userApiKey, userBaseUrl);
const mealsClient = new Client(mealsApiKey, mealsBaseUrl);

async function fetchData(client, collectionName) {
  try {
    const response = await client.find({
      dataSource: 'Cluster0',
      database: databaseName,
      collection: collectionName,
    });

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();
    return data.documents;
  } catch (error) {
    console.error(`Error fetching data from ${collectionName}:`, error);
    return { error: 'An error occurred' };
  }
}

// async function fetchUsers() {
//   return fetchData(userClient, 'users');
// }

async function fetchMeals() {
  return fetchData(mealsClient, 'meals');
}

// async function fetchFavorites() {
//   return fetchData(favoritesClient, 'favorites');
// }

module.exports = {
  fetchMeals,
};
