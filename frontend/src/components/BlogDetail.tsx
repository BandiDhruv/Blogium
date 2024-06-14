import { useMemo, useState, useEffect } from "react";
import { Blog, useGetUser } from "../hooks"
import { AppBar } from "./AppBar"
import { Avatar } from "./BlogCard"
import { FaEdit } from "react-icons/fa";
import { EditModal } from "./EditModal";
import { setWithExpiry } from "../hooks/cache";
import parse from 'html-react-parser'

export const BlogDetail = ({ blog }: { blog: Blog }) => {
    const {user} = useGetUser();
    const [modalToggle, setModalToggle] = useState<boolean>(false);

    const date = useMemo(() => {
        return blog.updated_at?.toLocaleString().split('T')[0] || "2030-01-01";
    }, [blog.updated_at]);

    useEffect(() => {
        setWithExpiry('lastVisitedBlog', blog, 2 * 60 * 60 * 1000);
    }, [blog]);
    console.log(blog)
    return (
        <div>
            <AppBar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 py-8 w-full max-w-screen-xl ">
                    <div className="col-span-8 ">
                        <div className="flex justify-between text-5xl font-extrabold">
                            <div>
                                {parse(blog.title)}
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="text-slate-500 pt-2">
                                {`Posted On ${date} `}
                            </div>
                            {user?.id === blog.author.id &&
                                <div className="mr-6">
                                    <FaEdit className="cursor-pointer hover:scale-110" onClick={() => { setModalToggle(!modalToggle) }} />
                                </div>
                            }
                        </div>
                        <div className="text-l font-medium pt-4 border-b border-dashed">
                                {parse(blog.content)}
                        </div>
                        {blog?.tags?.length > 0 && (
                            <div className="flex flex-wrap mt-2">
                            {blog.tags.map((tag, index) => (
                                <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                                {tag}
                                </span>
                            ))}
                            </div>
                        )}
                    </div>
                    <div className="col-span-4 ">
                        <div className="text-slate-400 font-bold text-lg">
                            Author 
                        </div>
                        <div className="flex px-1 gap-3 pt-2 border-t-2">
                            <div className="basis-1/6">
                                <Avatar name={blog.author.name || "Anonymous"} ProfilePic={blog.author.ProfilePic} />
                            </div>
                            <div className="basis-5/6">
                                <div className="text-xl font-bold">
                                    {blog.author.name || "Anonymous"}
                                </div>
                                <div className="pt-2 text-slate-400">
                                    {blog?.author.catchPhrase && blog?.author.catchPhrase.length > 50 ? blog?.author.catchPhrase : "Random Catch Phrase Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum error labore quaerat, id optio aliquid expedita veritatis molestias consequatur. Ratione quis doloribus voluptas voluptates consectetur non hic velit, soluta libero."}
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
    );
}