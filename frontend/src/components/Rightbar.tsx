import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../config';

export const RightBar: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const [url,setUrl]=useState<string>('');
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // console.log('File uploaded successfully:', response.data);
      setUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      RightBar
    </div>
  );
};
