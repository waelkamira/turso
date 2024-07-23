import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const mealsTable = sqliteTable('meals', {
  id: integer('id').primaryKey(),
  userName: text('user_name').notNull(),
  createdBy: text('created_by').notNull(),
  userImage: text('user_image').notNull(),
  mealName: text('meal_name').notNull(),
  selectedValue: text('selected_value').notNull(),
  image: text('image').notNull(),
  ingredients: text('ingredients').notNull(),
  theWay: text('the_way').notNull(),
  advise: text('advise'),
  link: text('link'),
  favorite: integer('favorite').notNull().default(0), // Using integer to represent boolean
  usersWhoLikesThisRecipe: text('users_who_likes_this_recipe')
    .notNull()
    .default('[]'),
  usersWhoPutEmojiOnThisRecipe: text('users_who_put_emoji_on_this_recipe')
    .notNull()
    .default('[]'),
  usersWhoPutHeartOnThisRecipe: text('users_who_put_heart_on_this_recipe')
    .notNull()
    .default('[]'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});

export type InsertMeal = typeof mealsTable.$inferInsert;
export type SelectMeal = typeof mealsTable.$inferSelect;

export const favoritePostsTable = sqliteTable('favorites', {
  id: integer('id').primaryKey(),
  favoritedByUser: text('favorited_by_user'),
  userName: text('user_name'),
  userImage: text('user_image'),
  mealName: text('meal_name'),
  selectedValue: text('selected_value'),
  image: text('image'),
  ingredients: text('ingredients'),
  theWay: text('the_way'),
  advise: text('advise'),
  link: text('link'),
  numberOfLikes: integer('number_of_likes').default(0),
  numberOfHearts: integer('number_of_hearts').default(0),
  numberOfEmojis: integer('number_of_emojis').default(0),
  heart: integer('heart').notNull().default(0), // Using integer to represent boolean
  like: integer('like').notNull().default(0), // Using integer to represent boolean
  emoji: integer('emoji').notNull().default(0), // Using integer to represent boolean
  postId: text('post_id'),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});

export type InsertFavoritePost = typeof favoritePostsTable.$inferInsert;
export type SelectFavoritePost = typeof favoritePostsTable.$inferSelect;

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password'),
  isAdmin: integer('is_admin').notNull().default(0), // Using integer to represent boolean
  image: text('image').default(
    'https://res.cloudinary.com/dh2xlutfu/image/upload/v1720033330/qvvkquzk4djn2bl9jcwb.jpg'
  ),
  googleId: text('google_id')
    .unique()
    .default(sql`(ABS(RANDOM() % 1000000000))`),
  createdAt: text('created_at')
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$onUpdate(
    () => new Date()
  ),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;
