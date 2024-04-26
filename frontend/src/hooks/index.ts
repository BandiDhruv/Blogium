import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog{
    content:string,
    title:string,
    id:string,
    author:{
        name:string,
    }
}
export const useBlog=({id}:{id:string}) => {
    const [loading,setLoading]=useState<Boolean>(true);
    const [blog,setBlog]=useState<Blog>();
    const token=localStorage.getItem("token");
    const extractedString = token?.slice(1, -1);

    async function  getBlogData(){
        try{
            const response=await axios.get(`${BACKEND_URL}/api/v1/blog/${id}`,{
                headers:{
                    Authorization: `bearer ${extractedString}`
                }
            })
            setBlog(response.data.blog);
            setLoading(false);
        }catch(er){
            alert("cannot fetch blogs");
        }
    }

    useEffect(()=>{
        getBlogData();
    },[])
    return {
        loading,blog
    }
}

export const useBlogs = () =>{
    const [loading,setLoading]=useState<Boolean>(true);
    const [blogs,setBlogs]=useState<Blog[]>([]);
    const token=localStorage.getItem("token");
    const extractedString = token?.slice(1, -1);

    async function  getBlogData(){
        try{
            const response=await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`,{
                headers:{
                    Authorization: `bearer ${extractedString}`
                }
            })
            setBlogs(response.data.blog);
            setLoading(false);
        }catch(er){
            alert("cannot fetch blogs");
        }
    }

    useEffect(()=>{
        getBlogData();
    },[])
    return {
        loading,blogs
    }
}