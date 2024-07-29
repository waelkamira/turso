import userPrisma from '../../../lib/UserPrismaClient';

import bcrypt from 'bcrypt';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  secret: process.env.NEXT_PUBLIC_SECRET,
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
        const email = credentials?.email;
        const password = credentials?.password;
        await userPrisma.$connect(); // التأكد من أن Prisma جاهزة
        const user = await userPrisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          throw new Error('Email not found');
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
          throw new Error('Incorrect password');
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    },
    async signIn({ account, profile }) {
      await userPrisma.$connect(); // التأكد من أن Prisma جاهزة

      if (account.provider === 'google') {
        const existingUser = await userPrisma.user.findUnique({
          where: { email: profile.email },
        });

        if (existingUser) {
          await userPrisma.$connect(); // التأكد من أن Prisma جاهزة
          if (!existingUser.googleId) {
            await userPrisma.user.update({
              where: { email: profile.email },
              data: { googleId: profile.sub },
            });
          }
        } else {
          await userPrisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              image: profile.picture,
              googleId: profile.sub,
            },
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
// import prisma from '../../../lib/PrismaClient';
// import bcrypt from 'bcrypt';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';

// export const authOptions = {
//   secret: process.env.NEXT_PUBLIC_SECRET,
//   providers: [
//     GoogleProvider({
//       clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
//       clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
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
//         const email = credentials?.email;
//         const password = credentials?.password;

//         const user = await prisma.user.findUnique({
//           where: { email },
//         });

//         if (!user) {
//           throw new Error('Email not found');
//         }

//         const checkPassword = await bcrypt.compare(password, user.password);
//         if (!checkPassword) {
//           throw new Error('Incorrect password');
//         }

//         return user;
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
//         const existingUser = await prisma.user.findUnique({
//           where: { email: profile.email },
//         });

//         if (existingUser) {
//           if (!existingUser.googleId) {
//             await prisma.user.update({
//               where: { email: profile.email },
//               data: { googleId: profile.sub },
//             });
//           }
//         } else {
//           await prisma.user.create({
//             data: {
//               email: profile.email,
//               name: profile.name,
//               image: profile.picture,
//               googleId: profile.sub,
//             },
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
