import { Link } from "react-router-dom"

interface BlogCardProps{
    id:string,
    authorName:string,
    title:string,
    content:string,
    publishedDate:Date,
    ProfilePic?:string,
}
export const BlogCard = ({authorName,title,content,publishedDate,id,ProfilePic}:BlogCardProps) => {
    const date:string = publishedDate?.toLocaleString().split('T')[0] || "2030-01-01";
// console.log(ProfilePic)
    return <Link to={`/blog/${id}`}>
    <div className="border-b border-slate-200 p-4 w-full  cursor-pointer">
        <div className="flex items-center">
            <div className="flex justify-center flex-col">
                < Avatar  name={authorName} ProfilePic={ProfilePic?ProfilePic:""}/> 
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
            {content?.length>150?content?.slice(0,150) + "...":content} 
            
        </div>
        <div className="text-slate-400 text-sm font-500 pt-3">
            {`${Math.ceil(content?.length/200)} minute(s) read`}
        </div>
    </div>
    </Link>

}
export function Avatar({ name,ProfilePic}: { name: string ,ProfilePic?:string}) {
    {
        return ProfilePic ?  (<img src={ProfilePic} className="w-10 h-10 rounded-full" alt={name}/>)
        : (
            <div className={`relative inline-flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-300 rounded-full dark:bg-gray-600`}>
            <span className="font-medium text-gray-600 dark:text-gray-300">{name[0].toUpperCase()}</span>
            </div>
        );
    }
}