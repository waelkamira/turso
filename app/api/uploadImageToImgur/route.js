import { NextResponse } from 'next/server';
import imgurClientManager from '../../../components/ImgurClientManager';

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('image');

  // Get the next available Client ID
  const clientId = imgurClientManager.getClientId();
  console.log('clientId', clientId);
  try {
    const imgurResponse = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: `Client-ID ${clientId}`,
      },
      body: file,
    });

    const data = await imgurResponse.json();

    if (imgurResponse.ok) {
      console.log('data', data);
      return NextResponse.json({ success: true, data: data.data });
    } else {
      return NextResponse.json(
        { success: false, error: data.data.error },
        { status: imgurResponse.status }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

//================================================================================

// 2. Create a Unified API Route for Image Upload
// Create an API route in your Next.js application to handle the image upload to either vgy.me or Imgur based on availability.

// pages/api/uploadImage.js
// import imageUploadClientManager from '../../lib/imageUploadClientManager';
// import formidable from 'formidable';
// import fs from 'fs';
// import FormData from 'form-data';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).send('Method Not Allowed');
//   }

//   const form = new formidable.IncomingForm();

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return res.status(500).json({ success: false, error: err.message });
//     }

//     const imageFile = files.image;

//     try {
//       let apiKey, service, uploadUrl, formData;

//       // Attempt to get vgy.me API key
//       try {
//         apiKey = imageUploadClientManager.getApiKey('vgyme');
//         service = 'vgyme';
//         uploadUrl = 'https://vgy.me/upload';
//         formData = new FormData();
//         formData.append('file', fs.createReadStream(imageFile.filepath));
//         formData.append('userkey', apiKey);
//       } catch (vgyMeError) {
//         // If vgy.me keys are exhausted, try Imgur
//         apiKey = imageUploadClientManager.getApiKey('imgur');
//         service = 'imgur';
//         uploadUrl = 'https://api.imgur.com/3/image';
//         formData = new FormData();
//         formData.append('image', fs.createReadStream(imageFile.filepath));
//       }

//       const response = await fetch(uploadUrl, {
//         method: 'POST',
//         headers: service === 'imgur' ? { Authorization: `Client-ID ${apiKey}` } : {},
//         body: formData,
//       });

//       const data = await response.json();

//       if (data.success) {
//         const imageUrl = service === 'vgyme' ? data.image : data.data.link;
//         res.status(200).json({ success: true, data: { link: imageUrl } });
//       } else {
//         res.status(500).json({ success: false, error: data.error });
//       }
//     } catch (error) {
//       res.status(500).json({ success: false, error: error.message });
//     }
//   });
// }
