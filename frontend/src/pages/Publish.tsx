import { ChangeEvent, useState } from 'react';
import { AppBar } from '../components/AppBar';
import { BACKEND_URL } from '../config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getWithExpiry, setWithExpiry } from '../hooks/cache';
import { TextEditor } from '../components/RichTextEditor'; 
import { Badge } from '@mantine/core';
import { LabelledInput } from '../components/Auth';
import { IoIosCloseCircleOutline } from "react-icons/io";


export const Publish = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tagInput, setTagInput] = useState<string>('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token')?.slice(1, -1);
  const [tags, setTags] = useState<Array<string>>([]);

  const handlePublish = async () => {
    console.log({title,description,tags});
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
        title,
        content: description,
        tags,
        
      }, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      const newBlog = response.data;
      const cachedBlogs = getWithExpiry('blogs') || [];
      const updatedBlogs = [newBlog, ...cachedBlogs];
      setWithExpiry('blogs', updatedBlogs, 2 * 60 * 60 * 1000); 

      navigate(`/blog/${newBlog.id}`);
    } catch (error) {
      alert('Failed to publish blog');
    }
  };

  const handleDescriptionChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setDescription(value);
    }
  };

  const handleTitleChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setTitle(value);
    }
  };

  const handleTagInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTagInput(event.target.value);
  };

  const handleAddTag = () => {
    if (tagInput) {
      const newTags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      setTags(prevTags => [...prevTags, ...newTags]);
      setTagInput(''); 
    }
  };

  const handleRemoveTag = (event: React.MouseEvent<SVGElement, MouseEvent>, tagToRemove: string) => {
    event.stopPropagation(); 
    setTags(prevTags => prevTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <AppBar />
      <div className="flex justify-center w-full pt-8">
        <div className="max-w-screen-lg w-full">
          <TextEditor
            label="Title"
            onChange={handleTitleChange}
            placeholder="Title"
            className="border-dashed border-x-transparent border-t-transparent"
          />

          <TextEditor
            label="Post"
            onChange={handleDescriptionChange}
            placeholder="What`s on your Mind"
            className="border-dashed border-x-transparent border-b-transparent"
          />

          {tags.length > 0 && (
            <div className="flex flex-wrap mt-2">
              {tags.map((tag, index) => (
                <Badge key={index} className="m-1 flex flex-row justify-center items-center ">
                  <div className='flex flex-row items-center justify-center gap-1'>
                    {tag}
                    <IoIosCloseCircleOutline className="mt-[2px]" onClick={(event) => handleRemoveTag(event, tag)} />
                  </div>
                </Badge>
              ))}
            </div>
          )}

          <LabelledInput
            label="Tags"
            onChange={handleTagInputChange}
            placeholder="Tags if you want "
            type="text"
            but={true}
            onClick={handleAddTag}
          />

          <button
            onClick={handlePublish}
            type="submit"
            className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800"
          >
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
};


export function TextEditors({ onChange, label, placeholder, rows, cols, defaultV }: { defaultV?: string, rows: number, cols: number, placeholder: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, label: string, }) {
  return (
    <div className="mt-2">
      <div className="w-full mb-4 ">
        <label>{label}</label>
        <div className="mt-2 flex items-center justify-between border">
          <div className="my-2 bg-white rounded-b-lg w-full">
            <textarea defaultValue={defaultV} onChange={onChange} rows={rows} cols={cols} className="block w-full text-sm text-gray-800 bg-gray-50 pl-2 outline-none" placeholder={placeholder} required />
          </div>
        </div>
      </div>
    </div>
  );
}