const { Schema, model, models } = require('mongoose');

const MealSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      required: true,
    },
    userImage: { type: String, required: true },
    mealName: {
      type: String,
      required: true,
    },
    selectedValue: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    ingredients: {
      type: String,
      required: true,
    },
    theWay: {
      type: String,
      required: true,
    },
    advise: {
      type: String,
    },
    link: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    likes: true,
    emojis: true,
    hearts: true,

    // comments: { type: [{}] }, يجب تعريف مخطط الكومنتات قبل نشر أي شيء
  },
  { timestamps: true }
);

export const Meal = models?.Meal || model('Meal', MealSchema);
