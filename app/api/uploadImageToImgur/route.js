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
