const { Schema, models, model } = require('mongoose');

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default:
        'https://res.cloudinary.com/dh2xlutfu/image/upload/v1720033330/qvvkquzk4djn2bl9jcwb.jpg',
    },
    googleId: {
      type: String,
      unique: true,
      default: () => (Math.random() * 1000000000).toString(), // Generates a random number as a string
    },
  },
  { timestamps: true }
);

export const User = models?.User || model('User', UserSchema);
