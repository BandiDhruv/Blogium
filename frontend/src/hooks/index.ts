import { useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";
import { getWithExpiry, setWithExpiry } from "./cache";

export interface Blog{
    content:string,
    title:string,
    id:string,
    author:{
        name:string,
        id:string,
        catchPhrase:string,
        ProfilePic:string,
    }
    created_at:Date,
    updated_at:Date,
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
            console.log(er);
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

export interface User{
    id:string,
    email:string,
    name?:string,
    password:string,
    catchPhrase?:string,
    created_at:Date,
    updated_at:Date,
    ProfilePic?:string
}
 export const useGetUser =  () =>{
    const [user,setUser]=useState<User>();
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
                setUser(response.data.data);
            }
        }catch(e){
            alert(e);
        }
    }
    useEffect(()=>{
        getUserId();
    },[])
    return {
        user
    }
 }
export const useBlogs = () =>{
    const [loading, setLoading] = useState<Boolean>(true);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const token = localStorage.getItem("token")?.slice(1, -1);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
        headers: {
          Authorization: `bearer ${token}`,
        },
      });
      console.log(response.data.blog)
      setBlogs(response.data.blog);
      setWithExpiry('blogs', response.data.blog, 2 * 60 * 60 * 1000); // 2 hours
      setLoading(false);
    } catch (error) {
      alert("cannot fetch blogs");
      setLoading(false);
    }
  };

  useEffect(() => {
    const cachedBlogs = getWithExpiry('blogs');
    if (cachedBlogs) {
      setBlogs(cachedBlogs);
      setLoading(false);
    } else {
      fetchBlogs();
    }
  }, []);

  return {
    loading,
    blogs,
  };
}