// import { usersConnection } from '../../../lib/MongoDBConnections'; // Adjust the import path accordingly
const initializeConnections = require('../../../lib/MongoDBConnections');
const { usersConnection } = await initializeConnections();

import { User } from '../models/UserModel';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcrypt';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../../../lib/Mongodb';

// Ensure the connection is ready before using it
async function connectToDatabase() {
  if (!usersConnection.readyState) {
    await usersConnection.openUri(process.env.NEXT_PUBLIC_MONGODB);
  }
}

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        name: { label: 'Your name', type: 'text', placeholder: 'Your name' },
        email: {
          label: 'Your email',
          type: 'email',
          placeholder: 'Your email',
        },
        password: {
          label: 'Your password',
          type: 'password',
          placeholder: 'Your password',
        },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const email = credentials?.email;
        const password = credentials?.password;
        const UserModel = usersConnection.model('User', User.schema);
        const user = await UserModel.findOne({ email });

        if (!user) {
          throw new Error('Email not found');
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
          throw new Error('Incorrect password');
        }

        return user || null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async signIn({ account, profile }) {
      if (account.provider === 'google') {
        await connectToDatabase();
        const UserModel = usersConnection.model('User', User.schema);
        const existingUser = await UserModel.findOne({ email: profile.email });

        if (existingUser) {
          if (!existingUser.googleId) {
            existingUser.googleId = profile.sub;
            await existingUser.save();
          }
        } else {
          await UserModel.create({
            email: profile.email,
            name: profile.name,
            image: profile.picture,
            googleId: profile.sub,
          });
        }

        return true;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  pages: { signIn: '/login' },
};

// import mongoose from 'mongoose';
// import { User } from '../models/UserModel';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
// import bcrypt from 'bcrypt';
// import { MongoDBAdapter } from '@auth/mongodb-adapter';
// import clientPromise from '../../../lib/Mongodb';

// const connectToDatabase = async () => {
//   if (mongoose.connection.readyState !== 1) {
//     await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB);
//   }
// };

// export const authOptions = {
//   secret: process.env.NEXT_PUBLIC_SECRET,
//   adapter: MongoDBAdapter(clientPromise),
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
//       //! يجب وضع هذا السطر هنا و الا سوف يقوم برفض كل الايميلات التي نريد التسجيل من خلالها
//       allowDangerousEmailAccountLinking: true,
//     }),
//     CredentialsProvider({
//       name: 'credentials',
//       credentials: {
//         name: { label: 'Your name', type: 'text', placeholder: 'Your name' },
//         email: {
//           label: 'Your email',
//           type: 'email',
//           placeholder: 'Your email',
//         },
//         password: {
//           label: 'Your password',
//           type: 'password',
//           placeholder: 'Your password',
//         },
//       },
//       async authorize(credentials) {
//         await connectToDatabase();
//         const email = credentials?.email;
//         const password = credentials?.password;
//         const user = await User.findOne({ email });

//         if (!user) {
//           throw new Error('Email not found');
//         }

//         const checkPassword = await bcrypt.compare(password, user.password);
//         if (!checkPassword) {
//           throw new Error('Incorrect password');
//         }

//         return user || null;
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       session.user.id = token.sub;
//       return session;
//     },
//     async signIn({ account, profile }) {
//       if (account.provider === 'google') {
//         await connectToDatabase();
//         const existingUser = await User.findOne({ email: profile.email });

//         if (existingUser) {
//           if (!existingUser.googleId) {
//             existingUser.googleId = profile.sub;
//             await existingUser.save();
//           }
//         } else {
//           await User.create({
//             email: profile.email,
//             name: profile.name,
//             image: profile.picture,
//             googleId: profile.sub,
//           });
//         }

//         return true;
//       }
//       return true;
//     },
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async redirect({ url, baseUrl }) {
//       return url.startsWith(baseUrl) ? url : baseUrl;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   debug: process.env.NODE_ENV === 'development',
//   pages: { signIn: '/login' },
// };
