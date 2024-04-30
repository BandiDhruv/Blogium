import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Blog{
    content:string,
    title:string,
    id:string,
    author:{
        name:string,
        id:string,
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

 export const useGetUser = () =>{
    const [userId,setUserId]=useState<string>('');
    const [userName,setUserName]=useState<string>('');
    const token=localStorage.getItem("token");
    const extractedString = token?.slice(1, -1);
    async function getUserId(){
        try{    
            const response=await axios.get(`${BACKEND_URL}/api/v1/user/getUser`,{
                headers:{
                    Authorization: `bearer ${extractedString}`
                }
            })
            if(response.status===200){
                setUserId(response.data.id);
                setUserName(response.data.name);
            }
        }catch(e){
            alert(e);
        }
    }
    useEffect(()=>{
        getUserId();
    },[])
    return {
        userId,userName
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