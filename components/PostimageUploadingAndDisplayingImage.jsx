import Image from 'next/image';
import { useState } from 'react';

const UploadForm = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('/api/uploadImageToPostimage', {
        method: 'POST',
        body: formData,
      });

      const { message, data } = await response.json();
      setUploadMessage(message);
      if (message === 'Image uploaded successfully!') {
        // Display the uploaded image URL here
        console.log('Uploaded image URL:', data.result.image);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative size-56">
      <div className="absolute top-0 left-0 flex flex-col justify-center items-center text-white z-50">
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleUpload}>Upload Image</button>{' '}
      </div>
      <div className="absolute top-0 left-0 w-80 h-56 border-2 border-one rounded-lg overflow-hidden z-10">
        {uploadedImage && (
          <div className="relative w-80 h-64">
            <Image
              src={uploadedImage}
              alt="Uploaded"
              layout="fill"
              objectFit="cover"
            />
          </div>
        )}
      </div>{' '}
    </div>
  );
};

export default UploadForm;
