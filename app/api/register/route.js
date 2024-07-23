// import { usersConnection } from '../../../lib/MongoDBConnections'; // Adjust the import path accordingly
const initializeConnections = require('../../../lib/MongoDBConnections');
const { usersConnection } = await initializeConnections();
import { User } from '../models/UserModel';
import bcrypt from 'bcrypt';

// Ensure the connection is ready before using it
async function ensureConnection() {
  if (!usersConnection.readyState) {
    await usersConnection.openUri(process.env.NEXT_PUBLIC_MONGODB);
  }
}

export async function POST(req) {
  await ensureConnection();

  const { name, email, password } = await req.json();
  const UserModel = usersConnection.model('User', User.schema);

  const isExist = await UserModel.findOne({ email });
  if (isExist) {
    throw new Error(
      'هذا الايميل موجود بالفعل قم بتسجيل الدخول او استخدم بريد الكتروني أخر'
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  return new Response(JSON.stringify(user), { status: 201 });
}

// import mongoose from 'mongoose';
// import { User } from '../models/UserModel';
// import bcrypt from 'bcrypt';

// export async function POST(req) {
//   await mongoose.createConnection(process.env.NEXT_PUBLIC_MONGODB);
//   const { name, email, password } = await req.json();

//   const isExist = await User.findOne({ email });
//   if (isExist) {
//     throw new Error(
//       'هذا الايميل موجود بالفعل قم بتسجيل الدخول او استخدم بريد الكتروني أخر'
//     );
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, password: hashedPassword });
//   // console.log('user', user);

//   return Response.json(user);
// }
