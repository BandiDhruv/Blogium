import { Dispatch, SetStateAction, useEffect, useState } from "react"
import axios from "axios";
import { BACKEND_URL } from "../config";
export enum VoteType {
  UPVOTE = "UPVOTE",
  DOWNVOTE = "DOWNVOTE",
}

export interface Vote {
  id: string;
  userId: string;
  postId: string;
  voteType: VoteType;
  created_at: Date;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  password: string;
  catchPhrase?: string;
  posts: Blog[];
  votes: Vote[];
  created_at: Date;
  updated_at: Date;
  ProfilePic?: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  published: boolean;
  author: User
  created_at: Date;
  updated_at: Date;
  tags: string[];
  comments: Comment[];
  votes: Vote[];
}

export interface Comment {
  id: string;
  content: string;
  likes: number;
  postId: string;
  parentId?: string;
  created_at: Date;
  updated_at: Date;
  replies: Comment[];
}

export const useVote = (blogId: string, setBlog: Dispatch<SetStateAction<Blog | undefined>>) => {
  const token = localStorage.getItem("token")?.slice(1, -1);
  const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE") => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/blog/vote`,
        {
          postId: blogId,
          voteType,
        }, {
          headers: {
            Authorization: `bearer ${token}`,
          },
        }
      );

      if (response.data) {
        const { blog } = response.data;
        setBlog(blog);
      }
    } catch (error) {
      console.error("Failed to vote on the post", error);
    }
  };

  return { handleVote };
};




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
        loading,blog,setBlog
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
