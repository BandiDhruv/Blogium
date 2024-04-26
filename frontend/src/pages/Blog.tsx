import { BlogDetail } from "../components/BlogDetail";
import { useBlog } from "../hooks"
import { useParams } from "react-router-dom";

export const Blog = () => {
  const {id}=useParams()
  const {blog ,loading}=useBlog({id:id || ""});
  if(loading){
    return <div>Loading...</div>
  }

  return (
    <div>
      <BlogDetail blog={blog}/>
    </div>
  )
}