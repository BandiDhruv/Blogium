import { useState } from "react";
import { GrClose } from "react-icons/gr";
import { Blog} from "../hooks";
import { BACKEND_URL } from "../config";
import axios from "axios";
interface EditModalProps {
    blog: Blog;
    modal: boolean;
    setModal: (modal: boolean) => void;
}
export const EditModal = ({
  blog,
  modal,
  setModal,
}:EditModalProps) => {
    const id=blog.id
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };
  const handleSubmit=async()=>{
    const token=localStorage.getItem("token")?.slice(1,-1)||"";

    try{
        const response = await axios.put(`${BACKEND_URL}/api/v1/blog`,{id:id,title:title,content:content},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        if(!response){alert("some internal error occured");}
        else {
            setModal(!modal);
        }
    }catch(e){
        alert(e);
    }
  }
  return (
    <div className="fixed top-0 left-0 w-screen h-screen backdrop-filter backdrop-blur-lg flex flex-col justify-center items-center">
      <GrClose
        onClick={() => {
          setModal(!modal);
        }}
        className="absolute cursor-pointer top-[12%] right-[21%]"
      />
      <div className="bg-slate-100 p-6 rounded-lg shadow-md w-[60%] h-[80%]">
        <label className="font-bold">Title</label>
        <input
          type="text"
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md h-[8%]"
          placeholder="Title"
          value={title}
          onChange={handleTitleChange}
        />
        <label className="font-bold">Content</label>
        <textarea
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md h-[70%] max-h-[70%]"
          placeholder="Content"
          value={content}
          onChange={handleContentChange}
        ></textarea>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={ handleSubmit}
        >
          Update
        </button>
      </div>
    </div>
  );
};
