const { Schema, model, models } = require('mongoose');

const FavoritePostsSchema = new Schema(
  {
    favoritedByUser: {
      type: String,
    },
    userName: {
      type: String,
    },
    userImage: {
      type: String,
    },
    mealName: {
      type: String,
    },
    selectedValue: {
      type: String,
    },
    image: {
      type: String,
    },
    ingredients: {
      type: String,
    },
    theWay: {
      type: String,
    },
    advise: {
      type: String,
    },
    link: {
      type: String,
    },
    numberOfLikes: {
      type: Number,
    },
    numberOfHearts: {
      type: Number,
    },
    numberOfEmojis: {
      type: Number,
    },
    heart: {
      type: Boolean,
      default: false,
    },
    like: {
      type: Boolean,
      default: false,
    },
    emoji: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Favorite =
  models?.Favorite || model('Favorite', FavoritePostsSchema);
