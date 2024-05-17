import { ChangeEvent, useState } from "react";
import { AppBar } from "../components/AppBar";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LabelledInput } from "../components/Auth";
import { getWithExpiry, setWithExpiry } from "../hooks/cache";

export const Publish = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();
  const token = localStorage.getItem('token')?.slice(1, -1);

  const handlePublish = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
        title,
        content: description,
      }, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      console.log(response.data);
      const newBlog = response.data;
      const cachedBlogs = getWithExpiry('blogs') || [];
      const updatedBlogs = [newBlog, ...cachedBlogs];
      setWithExpiry('blogs', updatedBlogs, 2 * 60 * 60 * 1000); // 2 hours

      navigate(`/blog/${newBlog.id}`);
    } catch (error) {
      alert("Failed to publish blog");
    }
  };

  return (
    <div>
      <AppBar />
      <div className="flex justify-center w-full pt-8 ">
        <div className="max-w-screen-lg w-full">
          <LabelledInput
            label="Title"
            type="text"
            placeholder="title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <TextEditor rows={8} cols={8} onChange={(e) => { setDescription(e.target.value) }} label="Post:" placeholder="Write an article" />
          <button onClick={handlePublish}
            type="submit" className="mt-4 inline-flex items-center px-5 py-2.5 text-sm font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
            Publish Post
          </button>
        </div>
      </div>
    </div>
  );
};

export function TextEditor({ onChange, label, placeholder, rows, cols, defaultV }: { defaultV?: string, rows: number, cols: number, placeholder: string, onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void, label: string, }) {
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
