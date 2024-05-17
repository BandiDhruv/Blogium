import { useState, useEffect } from "react";
import { BlogDetail } from "../components/BlogDetail";
import { Spinner } from "../components/Spinner";
import { Blog as B, useBlog } from "../hooks";
import { useParams } from "react-router-dom";
import { getWithExpiry } from "../hooks/cache";

export const Blog = () => {
    const {id} = useParams();
    const {blog, loading} = useBlog({id: id || ""});
    const [cachedBlog, setCachedBlog] = useState<B | null>(null);

    useEffect(() => {
        const cachedBlogData = getWithExpiry('lastVisitedBlog');
        if (cachedBlogData && cachedBlogData.id === id) {
            setCachedBlog(cachedBlogData);
        }
    }, [id]);

    if (loading && !cachedBlog) {
        return (
            <div className="h-screen w-full flex flex-col justify-center items-center">
                <Spinner />
            </div>
        );
    }

    return (
        <div>
            {cachedBlog ? <BlogDetail blog={cachedBlog}/> : blog && <BlogDetail blog={blog}/>}
        </div>
    );
}
