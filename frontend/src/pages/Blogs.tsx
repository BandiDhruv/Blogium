import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Layout } from "../components/Layout/layout";
import { useState, useEffect, useRef } from "react";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Blog } from "../hooks";
import { Spinner } from "../components/Spinner";

export const Blogs = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [scrollLoading, setScrollLoading] = useState<boolean>(false);
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const token = localStorage.getItem("token")?.slice(1, -1);
    const [offset, setOffset] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const isFetching = useRef<boolean>(false); 

    const fetchInitialBlogs = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk/${0}/${5}`, {
                headers: {
                    Authorization: `bearer ${token}`,
                },
            });
            setBlogs(response.data.blog);
            setLoading(false);
            setOffset(5);
        } catch (error) {
            alert("Cannot fetch blogs");
            setLoading(false);
        }
    };

    const fetchMoreBlogs = async () => {
        if (isFetching.current) return; 
        isFetching.current = true; 
        setScrollLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk/${offset}/${4}`, {
                headers: {
                    Authorization: `bearer ${token}`,
                },
            });
            const newBlogs = response.data.blog;
            setBlogs((prevBlogs) => [...prevBlogs, ...newBlogs]);
            setOffset((prevOffset) => prevOffset + 4);
            setHasMore(newBlogs.length > 0);
        } catch (error) {
            alert("Cannot fetch blogs");
        }
        setScrollLoading(false);
        isFetching.current = false; 
    };

    useEffect(() => {
        fetchInitialBlogs();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 100 && !scrollLoading && hasMore
            ) {
                fetchMoreBlogs();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrollLoading, hasMore, offset]);

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col justify-center items-center">
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
                <BlogSkeleton />
            </div>
        );
    }

    return (
        <Layout>
            {blogs.map(blog => (
                <BlogCard
                    key={blog.id}
                    id={blog.id}
                    authorName={blog?.author?.name || "Anonymous"}
                    title={blog.title}
                    content={blog.content}
                    publishedDate={blog.created_at}
                    ProfilePic={blog.author.ProfilePic}
                />
            ))}
            {scrollLoading && (
                <div className="flex flex-col items-center py-[2rem]">
                    <Spinner />
                </div>
            )}
        </Layout>
    );
};
