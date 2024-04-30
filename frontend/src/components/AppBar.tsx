import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"
import logo from "../assets/logo.png"
import { useGetUser } from "../hooks";

export const AppBar = () =>{
    const { userName }=useGetUser();
    return <div className="border-b flex justify-between px-10 py-4 items-center ">
        <Link to={'/blogs'} className="cursor pointer">
                <img src={logo} alt="Logo" className="h-10 w-[8rem]"/>
        </Link>
        <div>
            <Link to={"/publish"}>
                <button type="button" className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-full text-sm px-3 py-1.5 text-center mr-3 mb-2 cursor-pointer">New</button>
            </Link>
            <Avatar name={userName || "Anonymous"} />
        </div>
    </div>
}