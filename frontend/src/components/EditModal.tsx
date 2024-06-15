import { ChangeEvent, useState } from "react";
import { GrClose } from "react-icons/gr";
import { Blog} from "../hooks";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { TextEditor } from "./RichTextEditor";
import { Badge } from "@mantine/core";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LabelledInput } from "./Auth";
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
  const [tags, setTags] = useState<Array<string>>(blog.tags);
  const [tagInput, setTagInput] = useState<string>('');
  console.log(blog);
  // const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTitle(event.target.value);
  // };
  // const handleContentChange = (
  //   event: React.ChangeEvent<HTMLTextAreaElement>
  // ) => {
  //   setContent(event.target.value);
  // };
  const handleSubmit=async()=>{
    const token=localStorage.getItem("token")?.slice(1,-1)||"";

    try{
        const response = await axios.put(`${BACKEND_URL}/api/v1/blog`,{id:id,title:title,content:content,tags:tags},{
            headers:{
                Authorization:`Bearer ${token}`
            }
        });
        if(!response){
          alert("some internal error occured");
        }
        else {
            localStorage.removeItem("lastVisitedBlog");
            setModal(!modal);
        }
    }catch(e){
        alert(e);
    }
  }
  const handleDescriptionChange = (value: string | string[]) => {
    if (typeof value === 'string') {
      setContent(value);
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
    <div className="fixed top-0 left-0 w-screen h-screen backdrop-filter backdrop-blur-lg flex flex-col justify-center items-center">
      <GrClose
        onClick={() => {
          setModal(!modal);
        }}
        className="absolute cursor-pointer top-[12%] right-[21%]"
      />
      <div className="flex flex-col justify-center  bg-slate-100 p-6 rounded-lg shadow-md w-[60%] h-[80%] overflow-y-auto">

        <TextEditor
            label="Title"
            onChange={handleTitleChange}
            placeholder="Title"
            defaultV={title}
            className="border-dashed border-x-transparent border-t-transparent"
            />

          <TextEditor
            label="Post"
            defaultV={content}
            onChange={handleDescriptionChange}
            placeholder="What's On Your Mind"
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md w-24 "
          onClick={ handleSubmit}
        >
          Update
        </button>
      </div>
    </div>
  );
};
