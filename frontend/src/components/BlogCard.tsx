import { Link } from "react-router-dom"

interface BlogCardProps{
    id:string,
    authorName:string,
    title:string,
    content:string,
    publishedDate:Date
}
export const BlogCard = ({authorName,title,content,publishedDate,id}:BlogCardProps) => {
    const date:string = publishedDate?.toLocaleString().split('T')[0] || "2030-01-01";

    return <Link to={`/blog/${id}`}>
    <div className="border-b border-slate-200 p-4 w-full  cursor-pointer">
        <div className="flex items-center">
            <div className="flex justify-center flex-col">
                < Avatar  name={authorName}/> 
            </div>
            <div className="font-extralight pl-2 ">
                | {authorName} |
            </div>
            <div className="pl-2 font-thin text-slate-500">
                {date}
            </div>
        </div>
        <div className="text-xl font-semibold pt-2">
            {title}
        </div>
        <div className="text-md font-thin">
            {content?.slice(0,125)+"..."} 
        </div>
        <div className="text-slate-400 text-sm font-500 pt-3">
            {`${Math.ceil(content?.length/200)} minute(s) read`}
        </div>
    </div>
    </Link>

}
export function Avatar ({name}:{name:string}){
    return <div className={`relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600`}>
    <span className="font-medium text-gray-600 dark:text-gray-300">{name[0]}</span>
</div>
}