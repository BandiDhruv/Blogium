import { Blog } from "../hooks"
import { AppBar } from "./AppBar"
import { Avatar } from "./BlogCard"


export const BlogDetail = ({blog}:{blog:Blog}) =>{
    return <div>
        <AppBar />
        <div className="flex justify-center">
            <div className="grid grid-cols-12 px-10 py-8 w-full max-w-screen-xl ">
                <div className="col-span-8 ">
                    <div className="text-5xl font-extrabold">
                        {blog.title}
                    </div>
                    <div className="text-slate-500 pt-2">
                        Posted On 2nd December 2023
                    </div>
                    <div className="text-l font-medium pt-4">
                        {blog.content}
                    </div>
                </div>
                <div className="col-span-4 ">
                    <div className="text-slate-400 font-bold text-lg">
                        Author 
                    </div>
                    <div className="flex justify-between px-2 gap-4 pt-2 border-t-2">
                        <div>
                            <Avatar name={blog.author.name || "Anonymous"}/>
                        </div>
                        <div>
                            <div className="text-xl font-bold">
                                {blog.author.name || "Anonymous"}
                            </div>
                            <div className="pt-2 text-slate-400">
                                Random Catch Phrase Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum error labore quaerat, id optio aliquid expedita veritatis molestias consequatur. Ratione quis doloribus voluptas voluptates consectetur non hic velit, soluta libero.
                            </div>
                        </div>
                    </div>
                </div>
               
            </div>
        </div>
    </div>
}