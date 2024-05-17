import { BlogCard } from "../components/BlogCard"
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks"
import { Layout } from "../components/Layout/layout"
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

    return (
        <>
            <Layout>
                {
                blogs && blogs.map(blog =>
                    <BlogCard key = {blog.id} id={blog.id} authorName={blog?.author?.name || "Anonymous"} title={blog.title} content={blog.content} publishedDate={blog.created_at} />
                )}
            </Layout>
        </>
    )
}
