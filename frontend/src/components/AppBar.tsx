import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import logo from "../assets/logo.png";
import { useGetUser } from "../hooks";
import { useState, useEffect, useRef } from "react";

export const AppBar: React.FC = () => {
    const { user } = useGetUser();
    const [openOptions, setOpenOptions] = useState<boolean>(false);
    const optionsRef = useRef<HTMLDivElement>(null);
    const navigate=useNavigate();
    const handleLogout = () =>{
        localStorage.clear();
        navigate("/signin");
    }
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
                setOpenOptions(false);
            }
        };

        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, []);
    return (
        <div className="w-full border-b flex justify-between px-10 py-4 items-center">
            <Link to={'/blogs'} className="cursor pointer">
                <img src={logo} alt="Logo" className="h-10 w-[8rem]" />
            </Link>
            <div className="flex">
                <Link to={"/publish"}>
                    <button type="button" className="text-white bg-green-700 hover:bg-green-800 font-medium rounded-full text-sm px-3 py-1.5 text-center mr-3 mb-2 cursor-pointer">New</button>
                </Link>
                <div className="cursor-pointer flex flex-col relative" onClick={(e) => {e.stopPropagation(); setOpenOptions(!openOptions) }}>
                    <Avatar name={user?.name || "Anonymous"} ProfilePic={user?.ProfilePic} />
                    {openOptions && user &&
                        <div ref={optionsRef} className="z-10 absolute top-[50px] right-[5px] bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
                            <div className="  hover:bg-gray-100 px-4 py-3 text-sm text-gray-900">
                                <div>Welcome !</div>
                                <div className="font-medium truncate">{user?.email || "Anonymous@blogium.com"}</div>
                            </div>
                            <ul className="py-2 text-sm text-gray-700">
                                <li>
                                    <a href="/myprofile" className="block px-4 py-2 hover:bg-gray-100">Dashboard</a>
                                </li>
                                
                            </ul>
                            <div className="py-1">
                                <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>Sign out <span className="font-medium truncate">{user?.name}</span></a>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};
