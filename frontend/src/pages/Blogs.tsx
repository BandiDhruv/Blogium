import { AppBar } from "../components/AppBar"
import { BlogCard } from "../components/BlogCard"
import { useBlogs } from "../hooks"

export const Blogs = () => {
    const {loading,blogs}=useBlogs();
    if(loading){//TODO ADD SKELETON
        return <div>Loading...</div>;
    }
    // console.log(blogs)
    return (
    <div>
        <AppBar />
        <div className="flex justify-center">
            <div >
                {blogs && blogs.map(blog =>
                    <BlogCard key = {blog.id} id={blog.id} authorName={blog.author.name || "Anonymous"} title={blog.title} content={blog.content} publishedDate="24-04-2024" />
                )}
            </div>
        </div>
    </div>
    )
}
