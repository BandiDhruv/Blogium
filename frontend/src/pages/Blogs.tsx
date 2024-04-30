import { AppBar } from "../components/AppBar"
import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks"

export const Blogs = () => {
    const {loading,blogs}=useBlogs();
    if(loading){//TODO ADD SKELETON
        return <div className="h-screen w-full flex flex-col justify-center items-center">
            <BlogSkeleton />
            <br />
            <BlogSkeleton />
            <br />
            <BlogSkeleton />
            <br />
            <BlogSkeleton />
            <br />
        </div>
    }
    // console.log(blogs)
    return (
    <div className=" flex flex-col h-screen">
        <AppBar />
        <div className="flex justify-center h-[91.8%]">
            <div className="w-1/5  flex flex-col items-center border-r">
                <div className="cursor-pointer mt-8 p-4 rounded-xl w-[80%] bg-slate-100 hover:bg-slate-200 ">My Posts</div>
                <div className="cursor-pointer mt-8 p-4 rounded-xl w-[80%] bg-slate-100 hover:bg-slate-200 ">Profile</div>
            </div>
            <div  className="w-3/5 overflow-y-auto">
                {blogs && blogs.map(blog =>
                    <BlogCard key = {blog.id} id={blog.id} authorName={blog.author.name || "Anonymous"} title={blog.title} content={blog.content} publishedDate="24-04-2024" />
                )}
            </div>
            <div className="w-1/5 border-l">
                right side
            </div>
        </div>
    </div>
    )
}
