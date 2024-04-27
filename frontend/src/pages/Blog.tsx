import { BlogDetail } from "../components/BlogDetail";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom";

export const Blog = () => {
  const {id}=useParams()
  const {blog ,loading}=useBlog({id:id || ""});
  if(loading || !blog){
    return <div className="h-screen w-full flex flex-col justify-center items-center"><Spinner /></div>
  }
  
  return (
    <div>
      <BlogDetail blog={blog}/>
    </div>
  )
}