import { useState } from "react";
import { Blog, useGetUser } from "../hooks"
import { AppBar } from "./AppBar"
import { Avatar } from "./BlogCard"
import { FaEdit } from "react-icons/fa";
import { EditModal } from "./EditModal";

export const BlogDetail = ({blog}:{blog:Blog}) =>{
    const { user }=useGetUser();
    // console.log(userId)
    
    const [modalToggle,setModalToggle]=useState<boolean>(false);
    const date:string = blog.updated_at?.toLocaleString().split('T')[0] || "2030-01-01";
    return <div>
        <AppBar />
        <div className="flex justify-center">
            <div className="grid grid-cols-12 px-10 py-8 w-full max-w-screen-xl ">
                <div className="col-span-8 ">
                    <div className="flex justify-between text-5xl font-extrabold">
                        <div>
                            {blog.title}
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="text-slate-500 pt-2">
                            {`Posted On ${date} `}
                        </div>
                        {
                            user?.id === blog.author.id && 
                            <div className="mr-6">
                                <FaEdit className="cursor-pointer hover:scale-110" onClick={()=>{setModalToggle(!modalToggle)}}/> 
                            </div>
                        }
                    </div>
                    <div className="text-l font-medium pt-4">
                        {blog.content}
                    </div>
                </div>
                <div className="col-span-4 ">
                    <div className="text-slate-400 font-bold text-lg">
                        Author 
                    </div>
                    <div className="flex justify-evenly px-2 gap-4 pt-2 border-t-2">
                        <div>
                            <Avatar name={blog.author.name || "Anonymous"}/>
                        </div>
                        <div>
                            <div className="text-xl font-bold">
                                {blog.author.name || "Anonymous"}
                            </div>
                            <div className="pt-2 text-slate-400">
                                {blog?.author.catchPhrase && blog?.author.catchPhrase.length > 50 ? blog?.author.catchPhrase :"Random Catch Phrase Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum error labore quaerat, id optio aliquid expedita veritatis molestias consequatur. Ratione quis doloribus voluptas voluptates consectetur non hic velit, soluta libero."}
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
        {modalToggle && 
            <EditModal blog={blog} modal={modalToggle} setModal={setModalToggle} />
        }
    </div>
}