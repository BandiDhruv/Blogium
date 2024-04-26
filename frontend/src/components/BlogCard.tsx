interface BlogCardProps{
    authorName:string,
    title:string,
    content:string,
    publishedDate:string
}
export const BlogCard = ({authorName,title,content,publishedDate}:BlogCardProps) => {
    return <div className="border-b border-slate-200 p-4">
        <div className="flex items-center">
            <div className="flex justify-center flex-col">
                < Avatar name={authorName}/> 
            </div>
            <div className="font-extralight pl-2 ">
                | {authorName} |
            </div>
            <div className="pl-2 font-thin text-slate-500">
                {publishedDate}
            </div>
        </div>
        <div className="text-xl font-semibold pt-2">
            {title}
        </div>
        <div className="text-md font-thin">
            {content.slice(0,100)+"..."} 
        </div>
        <div className="text-slate-400 text-sm font-500 pt-3">
            {`${Math.ceil(content.length/100)} minute(s) read`}
        </div>
    </div>
}
function Avatar ({name}:{name:string}){
    return <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
    <span className="font-medium text-gray-600 dark:text-gray-300">{name[0]}</span>
</div>
}